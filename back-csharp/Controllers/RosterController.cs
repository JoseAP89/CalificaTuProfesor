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
    public class RosterController : ControllerBase
    {
        private readonly TeachersContext _context;

        public RosterController(TeachersContext context)
        {
            _context = context;
        }

        [HttpGet("info/{id:int}")]
        public async Task<ActionResult<RosterDto>> GetRoster(int id)
        {
            var roster = from c in _context.Rosters
                join s in _context.UniStructures on c.UniStructureId equals s.UniStructureId 
                join m in _context.Campuses on c.CampusId equals m.CampusId 
                where c.RosterId == id select new
                {
                    RosterId = c.RosterId,
                    TeacherName = c.TeacherName,
                    TeacherLastname1 = c.TeacherLastname1,
                    TeacherLastname2 = c.TeacherLastname2,
                    UniStructureId = c.UniStructureId,
                    StructureType = s.Name,
                    StructureName = c.StructureName,
                    SubjectName = c.SubjectName,
                    CampusId = c.CampusId,
                    CampusName = m.Name
                };
            var res = (await roster.AsNoTracking().ToListAsync())?.Select( x => 
                new RosterDto
                {
                    RosterId = x.RosterId,
                    TeacherName = x.TeacherName,
                    TeacherLastname1 = x.TeacherLastname1,
                    TeacherLastname2 = x.TeacherLastname2,
                    UniStructureId = x.UniStructureId,
                    StructureType = x.StructureType,
                    StructureName = x.StructureName,
                    SubjectName = x.SubjectName,
                    CampusId = x.CampusId,
                    CampusName = x.CampusName,
                }).SingleOrDefault();
            if (res==null)
            {
                return NoContent();
            }
            return Ok(res);
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
                .AsNoTracking()
                .Select(x => x.RosterId)
                .ToListAsync();
            var res = await (from c in _context.Campuses
                join r in _context.Rosters on c.CampusId equals r.CampusId
                where teacher_ids.Contains(r.RosterId)
                orderby r.TeacherName, r.TeacherLastname1, r.TeacherLastname2, c.Name
                select new TeacherCampus()
                {
                    RosterId = r.RosterId,
                    TeacherName = r.TeacherName,
                    TeacherLastname1 = r.TeacherLastname1,
                    TeacherLastname2 = r.TeacherLastname2,
                    Campus = new CampusDto {Name = c.Name, CampusId = c.CampusId, UniversityId = c.UniversityId},
                    SubjectName = r.SubjectName
                }).AsNoTracking().ToListAsync();
            if (res==null)
            {
                return NoContent();
            }
            return Ok(res);
        }
        
        [HttpPost]
        public async Task<ActionResult<RosterDto>> AddRoster(CreateRosterDto rosterDto)
        {
            try
            {
                var roster = new Roster()
                {
                    RosterId = rosterDto.RosterId,
                    TeacherName = rosterDto.TeacherName.Trim().ToUpper(),
                    TeacherLastname1 = rosterDto.TeacherLastname1.Trim().ToUpper(),
                    TeacherLastname2 = rosterDto.TeacherLastname2?.Trim().ToUpper(),
                    UniStructureId = rosterDto.UniStructureId,
                    StructureName = rosterDto.StructureName,
                    SubjectName = rosterDto.SubjectName,
                    CampusId = rosterDto.CampusId
                };
                _context.Rosters.Add(roster);
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetRoster),
                    new { id = roster.RosterId},
                    roster
                );
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest($"Hubo un error al agregar al Profesor {rosterDto.TeacherName + " " + rosterDto.TeacherLastname1 + " " + (rosterDto.TeacherLastname2 ?? "")}.");
            }

        }
        
    }
}
