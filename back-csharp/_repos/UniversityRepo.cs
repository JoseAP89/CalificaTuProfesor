using back_csharp._contracts;
using back_csharp._models;
using back_csharp._dtos;
using back_csharp._helpers;
using Microsoft.EntityFrameworkCore;
using back_csharp._data;
using back_csharp.Middleware.models;

namespace back_csharp._repos;

public class UniversityRepo: CommonRepo<University>, IUniversityRepo
{
    public UniversityRepo(TeachersContext context, IConfiguration config) : base(context, config)
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
        var query = _context.Universities
                .AsNoTracking()
                .Where(u => EF.Functions.ILike(
                    TeachersContext.Unaccent(u.Name).Trim().ToLower(),
                    "%" + text + "%"))
                .OrderBy(u => u.Name)
                .Take(MAX_RESULTS);
        var res = (await query.ToListAsync())?.Select(x =>
            new Vessel { Id = x.UniversityId, Value = x.Name }).ToList();
        return res;

    }

    public async Task<University> Add(UniversityDto entitydto)
    {
        var name = entitydto.Name.Trim().ToLower().RemoveDiacritics();
        var universities = await _context.Set<University>().FromSqlInterpolated<University>(
            $"SELECT * FROM university u WHERE LOWER(UNACCENT(u.name)) LIKE '%' || {name} || '%' ")
            .AsNoTracking()
            .ToListAsync();
        if (universities.Count>0 )
        {
            throw new ApiException("No puede agregarse ya que ya existe una Universidad con ese nombre.");
        }
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
            string path = _config.GetValue<string>("Images:university");
            path += img_name + "." + universitydto.ImgType;
            var data = universitydto.ImgFile.Base64Decode();
            
            await System.IO.File.WriteAllBytesAsync(path,data);
        }

    }
}