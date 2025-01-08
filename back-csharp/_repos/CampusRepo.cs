using back_csharp._contracts;
using back_csharp._models;
using back_csharp._dtos;
using back_csharp._helpers;
using Microsoft.EntityFrameworkCore;
using back_csharp._data;
using Npgsql;

namespace back_csharp._repos;

public class CampusRepo: CommonRepo<Campus>, ICampusRepo
{
    public CampusRepo(TeachersContext context, IConfiguration config) : base(context, config)
    {
    }

    public async Task<Campus> GetShortCampus(int id)
    {
        var campus = await _context.Set<Campus>().FirstOrDefaultAsync( c => c.CampusId == id);
        return campus;

    }

    public async Task<Campus> GetShortCampus(string name)
    {
        name = name.Replace("+", " ").Trim().ToLower();
        var campus = await _context.Set<Campus>().FirstOrDefaultAsync(c => c.Name.ToLower().Equals(name));
        return campus;
    }

    public async Task<CampusDto> GetCampusByRecordIdAsync(Guid recordId)
    {
        int id = (await _context.Set<Campus>().FirstOrDefaultAsync(c => c.RecordId == recordId))?.CampusId ?? 0;
        return await GetCampusAsync(id); 
    }

    public async Task<CampusDto> GetCampusAsync(int id)
    {
        string path = _config.GetValue<string>("Images:campus");
        var campus = from c in _context.Set<Campus>()
            join u in _context.Set<University>() on c.UniversityId equals u.UniversityId 
            join s in _context.Set<State>() on c.StateId equals s.StateId 
            where c.CampusId == id select new
            {
                Name = c.Name,
                RecordId = c.RecordId,
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
                RecordId = x.RecordId,  
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
            if (!string.IsNullOrEmpty(fullFileName))
            {
                var pos = fullFileName.LastIndexOf("/");
                fullFileName = fullFileName[(pos+1)..];
            } else
            {
                fullFileName = "generic-campus-1.png";  
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
        var campus = await _context.Set<Campus>().FromSqlInterpolated(
                $"SELECT * FROM Campus c WHERE LOWER(UNACCENT(c.Name)) LIKE '%' || {search} || '%' LIMIT {MAX_RESULTS}"
            )
            .AsNoTracking()
            .ToListAsync();
        var res = campus?.Select( x => 
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
            var campusIds = await _context.Set<Campus>().FromSqlInterpolated<Campus>(
                $"SELECT * FROM Campus c WHERE LOWER(UNACCENT(c.Name)) LIKE '%' || {search} || '%' LIMIT {MAX_RESULTS} ")
                .AsNoTracking()
                .Select(x => x.CampusId)
                .ToListAsync();
            var res = await (from c in _context.Set<Campus>()
                join u in _context.Set<University>() on c.UniversityId equals u.UniversityId
                where campusIds.Contains(c.CampusId)
                orderby c.Name
                select new CampusUniversity
                {
                    CampusId = c.CampusId,
                    Name = c.Name,
                    RecordId = c.RecordId,
                    University = new UniversityDto {UniversityId = u.UniversityId, Name = u.Name}
                }).AsNoTracking().ToListAsync();
            return res;
        }
    
        public async Task<Campus> AddCampus(CampusDto campusDto)
        {
            var name = campusDto.Name.ToLower().Trim().RemoveDiacritics();
            var campuses = await _context.Set<University>().FromSqlInterpolated<University>(
                $"SELECT * FROM campus u WHERE LOWER(UNACCENT(u.name)) LIKE '%' || {name} || '%' ")
                .AsNoTracking()
                .ToListAsync();
            if (campuses.Count>0 )
            {
                throw new BadHttpRequestException("No puede agregarse ya que ya existe un Campus con ese nombre.");
            }
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
                string path = _config.GetValue<string>("Images:campus");
                path += img_name + "." + campusDto.ImgType;
                var data = campusDto.ImgFile.Base64Decode();
                await File.WriteAllBytesAsync(path,data);
            }
            
            _context.Set<Campus>().Add(campus);
            return campus;

        }
}