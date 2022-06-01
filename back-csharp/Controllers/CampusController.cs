using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
using back_csharp._contracts;
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
        private readonly IUnitOfWork _uow;

        public CampusController(IUnitOfWork uow)
        {
            _uow = uow;
        }

        [HttpGet("info/{id:int}")]
        public async Task<ActionResult<CampusDto>> GetCampus(int id)
        {
            var res = await _uow.Campus.GetCampus(id);
            if (res==null)
            {
                return NoContent();
            } 
            return Ok(res);
        }
        
        [HttpGet("{search}")]
        public async Task<ActionResult<IEnumerable<Vessel>>> GetCampusSearch(string search)
        {
            var res = await _uow.Campus.GetCampusSearch(search);
            if (res==null)
            {
                return NoContent();
            }
            return Ok(res);
        }
        
        [HttpGet("university/{search}")]
        public async Task<ActionResult<IEnumerable<CampusUniversity>>> GetCampusUniversity(string search)
        {
            var res = await _uow.Campus.GetCampusUniversity(search);
            if (res==null)
            {
                return NoContent();
            }
            return Ok(res);
        }
        
        [HttpPost]
        public async Task<ActionResult<Campus>> AddCampus(CampusDto campusDto)
        {
            try
            {
                var campus = await _uow.Campus.AddCampus(campusDto);
                
                await _uow.Save();

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
