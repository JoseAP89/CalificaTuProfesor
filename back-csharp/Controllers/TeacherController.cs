using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
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
    public class TeacherController : ControllerBase
    {
        private readonly TeachersContext _context;

        public TeacherController(TeachersContext context)
        {
            _context = context;
        }

        [HttpGet("campus/{search}")]
        public async Task<ActionResult<IEnumerable<TeacherCampus>>> GetTeacherCampus(string search)
        {
            const int MAX_RESULTS = 20;
            search = search
                .Replace("+", " ")
                .Trim()
                .ToLower()
                .RemoveDiacritics();
            var teacher_ids = await _context.Rosters.FromSqlRaw<Roster>(
                $"SELECT * FROM roster r WHERE LOWER(UNACCENT(CONCAT(r.teacher_name,' ', r.teacher_lastname1, ' ', r.teacher_lastname2))) LIKE '%{search}%'  LIMIT {MAX_RESULTS} ")
                .Select(x => x.RosterId)
                .ToListAsync();
            var res = await (from c in _context.Campuses
                join r in _context.Rosters on c.CampusId equals r.CampusId
                where teacher_ids.Contains(r.RosterId)
                select new TeacherCampus()
                {
                    RosterId = r.RosterId,
                    TeacherName = r.TeacherName,
                    TeacherLastname1 = r.TeacherLastname1,
                    TeacherLastname2 = r.TeacherLastname2,
                    Campus = new CampusDto {Name = c.Name, CampusId = c.CampusId, UniversityId = c.UniversityId}
                }).ToListAsync();
            if (res==null)
            {
                return NoContent();
            }
            return Ok(res);
        }
        
    }
}
