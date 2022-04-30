using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using back_csharp._data;
using back_csharp._dtos;
using Microsoft.EntityFrameworkCore;

namespace back_csharp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CampusController : ControllerBase
    {
        private readonly TeachersContext _context;

        public CampusController(TeachersContext context)
        {
            _context = context;
        }

        [HttpGet("{quantity}")]
        public async Task<ActionResult<IEnumerable<Vessel>>> GetCampus(int quantity)
        {
            var campus = from c in _context.Campuses
                orderby c.Name select c;
            var res = (await campus.Take(quantity).ToListAsync())?.Select( x => 
                new Vessel{Id = x.CampusId, Value = x.Name});
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
            search = search.Replace("+", " ").Trim();
            search = search.ToLower();
            var campus_ids = await _context.Campuses.FromSqlRaw<Campus>(
                $"SELECT * FROM campus c WHERE LOWER(UNACCENT(c.name)) LIKE '%{search}%' OR LOWER(c.name) LIKE '%{search}%' LIMIT {MAX_RESULTS} ")
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
                }).ToListAsync();
            if (res==null)
            {
                return NoContent();
            }
            return Ok(res);
        }
        
    }
}
