using back_csharp._contracts;
using back_csharp._data;
using back_csharp._dtos;
using back_csharp._helpers;
using Microsoft.EntityFrameworkCore;

namespace back_csharp._repos;

public class CampusRepo: CommonRepo<Campus>, ICampusRepo
{
    public CampusRepo(DbContext context, IConfiguration config) : base(context, config)
    {
    }

    public async Task<CampusDto> GetCampus(int id)
    {
        string path = _config["Images:campus"];
        var campus = from c in _context.Set<Campus>()
            join u in _context.Set<University>() on c.UniversityId equals u.UniversityId 
            join s in _context.Set<State>() on c.StateId equals s.StateId 
            where c.CampusId == id select new
            {
                Name = c.Name,
                CampusId = c.CampusId,
                UniversityId = c.UniversityId,
                UniversityName = u.Name,
                StateId = c.StateId,
                StateName = s.Name,
            };
        var res = await (campus.AsNoTracking()
            .Select(x => new CampusDto
            {
                Name = x.Name,
                CampusId = x.CampusId,
                UniversityId = x.UniversityId,
                UniversityName = x.UniversityName,
                StateId = x.StateId,
                StateName = x.StateName,
            })
            .SingleOrDefaultAsync());
        if (res != null)
        {
            var fileName =  res.Name.Replace(" ", "_").ToLower().Trim() ;
            var files = Directory.GetFiles(path, $"{fileName}.*");
            string fullFileName = files.FirstOrDefault();
            if (fullFileName != null)
            {
                var pos = fullFileName.LastIndexOf("/");
                fullFileName = fullFileName[(pos+1)..];
            }
            res.FullFileName = fullFileName;
        }
        return res;
    }
    
    public async Task<IEnumerable<Vessel>> GetCampusSearch(string search)
    {
        search = search
            .Replace("+", " ")
            .Trim()
            .ToLower()
            .RemoveDiacritics();
        var campus_ids = await _context.Set<Campus>().FromSqlRaw<Campus>(
            $"SELECT * FROM campus c WHERE LOWER(UNACCENT(c.name)) LIKE '%{search}%'  LIMIT {MAX_RESULTS} ")
            .AsNoTracking()
            .Select(x => x.CampusId)
            .ToListAsync();
        var campus = from c in _context.Set<Campus>()
            where campus_ids.Contains(c.CampusId) select c;
        var res = (await campus.AsNoTracking().ToListAsync())?.Select( x => 
            new Vessel{Id = x.CampusId, Value = x.Name});
        return res;
    }
    
        public async Task<IEnumerable<CampusUniversity>> GetCampusUniversity(string search)
        {
            search = search
                .Replace("+", " ")
                .Trim()
                .ToLower()
                .RemoveDiacritics();
            var campus_ids = await _context.Set<Campus>().FromSqlRaw<Campus>(
                $"SELECT * FROM campus c WHERE LOWER(UNACCENT(c.name)) LIKE '%{search}%' LIMIT {MAX_RESULTS} ")
                .AsNoTracking()
                .Select(x => x.CampusId)
                .ToListAsync();
            var res = await (from c in _context.Set<Campus>()
                join u in _context.Set<University>() on c.UniversityId equals u.UniversityId
                where campus_ids.Contains(c.CampusId)
                orderby c.Name
                select new CampusUniversity
                {
                    CampusId = c.CampusId,
                    Name = c.Name,
                    University = new UniversityDto {UniversityId = u.UniversityId, Name = u.Name}
                }).AsNoTracking().ToListAsync();
            return res;
        }
    
        public async Task<Campus> AddCampus(CampusDto campusDto)
        {
            var campus = new Campus
            {
                CampusId = 0,
                Name = campusDto.Name.Trim().ToUpper(),
                StateId = campusDto.StateId,
                UniversityId = campusDto.UniversityId,
            };
            if (campusDto.ImgFile != null)
            {
                string img_name = campusDto.Name.Replace(" ", "_").ToLower().Trim();
                string path = "/home/joseap/Documents/projects/CalificaTuProfesor/front/public/campuses/";
                path += img_name + "." + campusDto.ImgType;
                var data = campusDto.ImgFile.Base64Decode();
                System.IO.File.WriteAllBytesAsync(path,data);
            }
            
            _context.Set<Campus>().Add(campus);
            return campus;

        }
}