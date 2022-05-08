using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using back_csharp._data;
using back_csharp._dtos;
using back_csharp._helpers;
using Microsoft.EntityFrameworkCore;

namespace back_csharp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CampusController : ControllerBase
    {
        private readonly TeachersContext _context;
        private readonly IMapper _autoMapper;
        private readonly IConfiguration _config;

        public CampusController(TeachersContext context, IMapper _mapper, IConfiguration config)
        {
            _config = config;
            _autoMapper = _mapper;
            _context = context;
        }

        [HttpGet("info/{id}")]
        public async Task<ActionResult<CampusDto>> GetCampus(int id)
        {
            string path = _config["Images:campus"];
            string[] allowedFormats = _config.GetSection("Images:allowedFormats").Get<string[]>();
            var campus = from c in _context.Campuses
                where c.CampusId == id select c;
            var res = (await campus.AsNoTracking()
                .Select(x => new CampusDto
                {
                    Name = x.Name,
                    CampusId = x.CampusId,
                    UniversityId = x.UniversityId,
                    StateId = x.StateId
                })
                .SingleOrDefaultAsync());
            if (res==null)
            {
                return NoContent();
            } 
            var fileName =  res.Name.Replace(" ", "_").ToLower().Trim() ;
            var files = Directory.GetFiles(path, $"{fileName}.*");
            string fullFileName = files.FirstOrDefault();
            if (fullFileName != null)
            {
                var pos = fullFileName.LastIndexOf("/");
                fullFileName = fullFileName.Substring(pos+1);
            }
            res.FullFileName = fullFileName;
            Console.WriteLine("********* " + fullFileName);
            return Ok(res);
        }
        
        [HttpGet("{search}")]
        public async Task<ActionResult<Vessel>> GetCampusSearch(string search)
        {
            const int MAX_RESULTS = 20;
            search = search
                .Replace("+", " ")
                .Trim()
                .ToLower()
                .RemoveDiacritics();
            var campus_ids = await _context.Campuses.FromSqlRaw<Campus>(
                $"SELECT * FROM campus c WHERE LOWER(UNACCENT(c.name)) LIKE '%{search}%'  LIMIT {MAX_RESULTS} ")
                .AsNoTracking()
                .Select(x => x.CampusId)
                .ToListAsync();
            var campus = from c in _context.Campuses
                where campus_ids.Contains(c.CampusId) select c;
            var res = (await campus.AsNoTracking().ToListAsync())?.Select( x => 
                new Vessel{Id = x.CampusId, Value = x.Name}).SingleOrDefault();
            if (res==null)
            {
                return NoContent();
            }
            return Ok(res);
        }
        
        [HttpGet("university/{search}")]
        public async Task<ActionResult<IEnumerable<CampusUniversity>>> GetCampusUniversity(string search)
        {
            const int MAX_RESULTS = 20;
            search = search
                .Replace("+", " ")
                .Trim()
                .ToLower()
                .RemoveDiacritics();
            var campus_ids = await _context.Campuses.FromSqlRaw<Campus>(
                $"SELECT * FROM campus c WHERE LOWER(UNACCENT(c.name)) LIKE '%{search}%' LIMIT {MAX_RESULTS} ")
                .AsNoTracking()
                .Select(x => x.CampusId)
                .ToListAsync();
            var res = await (from c in _context.Campuses
                join u in _context.Universities on c.UniversityId equals u.UniversityId
                where campus_ids.Contains(c.CampusId)
                select new CampusUniversity
                {
                    CampusId = c.CampusId,
                    Name = c.Name,
                    University = new UniversityDto {UniversityId = u.UniversityId, Name = u.Name}
                }).AsNoTracking().ToListAsync();
            if (res==null)
            {
                return NoContent();
            }
            return Ok(res);
        }
        
        [HttpPost]
        public async Task<ActionResult<IEnumerable<UniversityDto>>> AddCampus(CampusDto campusDto)
        {
            try
            {
                var campus = _autoMapper.Map<Campus>(campusDto);
                campus.Name = campus.Name.Trim().ToUpper();
                if (campusDto.ImgFile != null)
                {
                    string img_name = campusDto.Name.Replace(" ", "_").ToLower().Trim();
                    string path = "/home/joseap/Documents/projects/CalificaTuProfesor/front/public/campuses/";
                    path += img_name + "." + campusDto.ImgType;
                    var data = campusDto.ImgFile.Base64Decode();
                    System.IO.File.WriteAllBytesAsync(path,data);
                }
                
                _context.Campuses.Add(campus);
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetCampus),
                    new { id = campusDto.CampusId},
                    campus
                );
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest($"Hubo un error al agregar el campus {campusDto.Name}.");
            }

        }
        
    }
}
