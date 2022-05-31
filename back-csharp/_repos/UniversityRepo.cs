using back_csharp._contracts;
using back_csharp._data;
using back_csharp._dtos;
using back_csharp._helpers;
using Microsoft.EntityFrameworkCore;

namespace back_csharp._repos;

public class UniversityRepo: CommonRepo<University>, IUniversityRepo
{
    public UniversityRepo(DbContext context, IConfiguration config) : base(context, config)
    {
        
    }

    public async Task<IEnumerable<Vessel>> Search(string text)
    {
        const int MAX_RESULTS = 20;
        text = text
            .Replace("+", " ")
            .Trim()
            .ToLower()
            .RemoveDiacritics();
        var university_ids = await _context.Set<University>().FromSqlRaw<University>(
            $"SELECT * FROM university u WHERE LOWER(UNACCENT(u.name)) LIKE '%{text}%'  LIMIT {MAX_RESULTS} ")
            .AsNoTracking()
            .Select(x => x.UniversityId)
            .ToListAsync();
        var uni = from u in _context.Set<University>()
            where university_ids.Contains(u.UniversityId) select u;
        var res = (await uni.AsNoTracking().ToListAsync())?.Select( x => 
            new Vessel{Id = x.UniversityId, Value = x.Name}).ToList();
        return res;
    }

    public async Task<University> Add(UniversityDto entitydto)
    {
        var university = new University
        {
            UniversityId = 0,
            Name = entitydto.Name.Trim().ToUpper()
        };
        await base.Add(university);
        return university;
    }

    public async Task AddImage(UniversityDto universitydto)
    {
        if (universitydto.ImgFile != null)
        {
            string img_name = universitydto.Name.Replace(" ", "_").ToLower().Trim();
            string path = "/home/joseap/Documents/projects/CalificaTuProfesor/front/public/universities/";
            path += img_name + "." + universitydto.ImgType;
            var data = universitydto.ImgFile.Base64Decode();
            
            await System.IO.File.WriteAllBytesAsync(path,data);
        }

    }
}