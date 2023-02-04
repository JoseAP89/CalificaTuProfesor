using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using back_csharp._contracts;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using back_csharp._models;
using back_csharp._dtos;
using back_csharp._helpers;
using Microsoft.EntityFrameworkCore;

namespace back_csharp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RosterController : ControllerBase
    {
        private readonly IUnitOfWork _uow;

        public RosterController(IUnitOfWork uow)
        {
            _uow = uow;
        }

        [HttpGet("{id:int}")]
        public async Task<ActionResult<Roster>> GetRoster(int id)
        {
            var res = await _uow.Roster.GetRoster(id);
            if (res==null)
            {
                return NotFound();
            }
            return Ok(res);
        }
        
        [HttpGet("info/{id:int}")]
        public async Task<ActionResult<RosterDto>> GetRosterInfo(int id)
        {
            var res = await _uow.Roster.GetRosterDTO(id);
            if (res==null)
            {
                return NotFound();
            }
            return Ok(res);
        }
        
        [HttpGet("info/recordid/{recordId}")]
        public async Task<ActionResult<RosterDto>> GetRosterInfo(Guid recordId)
        {
            var res = await _uow.Roster.GetRosterDTO(recordId);
            if (res==null)
            {
                return NotFound();
            }
            return Ok(res);
        }
        
        [HttpGet("campus/{search}")]
        public async Task<ActionResult<IEnumerable<TeacherCampus>>> GetTeacherCampus(string search)
        {
            var res = await _uow.Roster.GetTeacherCampus(search);
            if (res==null)
            {
                return NotFound();
            }
            return Ok(res);
        }
        
        [HttpPost]
        public async Task<ActionResult<RosterDto>> AddRoster(CreateRosterDto rosterDto)
        {
            try
            {
                var roster = await _uow.Roster.AddRoster(rosterDto);
                if (roster == null)
                {
                    return BadRequest();
                }
                await _uow.Save();

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
