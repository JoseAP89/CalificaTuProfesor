using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using AutoMapper;
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
    public class CampusController : ControllerBase
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public CampusController(IUnitOfWork uow, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }

        [HttpGet("{name}")]
        public async Task<ActionResult<ShortCampusDTO>> GetShortCampusByName(string name)
        {
            var res = await _uow.Campus.GetShortCampus(name);
            if (res==null)
            {
                return NotFound();
            } 
            return Ok(_mapper.Map<ShortCampusDTO>(res));
        }
        
        [HttpGet("info/{id:int}")]
        public async Task<ActionResult<CampusDto>> GetCampus(int id)
        {
            var res = await _uow.Campus.GetCampusAsync(id);
            if (res==null)
            {
                return NotFound();
            } 
            return Ok(res);
        }
        
        [HttpGet("info/record/{recordId}")]
        public async Task<ActionResult<CampusDto>> GetCampusByRecordId(Guid recordId)
        {
            var res = await _uow.Campus.GetCampusByRecordIdAsync(recordId);
            if (res==null)
            {
                return NotFound();
            } 
            return Ok(res);
        }
        
        [HttpGet("search/{search}")]
        public async Task<ActionResult<IEnumerable<Vessel>>> GetCampusSearch(string search)
        {
            var res = await _uow.Campus.GetCampusSearch(search);
            if (res==null)
            {
                return NotFound();
            }
            return Ok(res);
        }
        
        [HttpGet("university/{search}")]
        public async Task<ActionResult<IEnumerable<CampusUniversity>>> GetCampusUniversity(string search)
        {
            var res = await _uow.Campus.GetCampusUniversity(search);
            if (res==null)
            {
                return NotFound();
            }
            return Ok(res);
        }
        
        [HttpPost]
        public async Task<ActionResult<Campus>> AddCampus(CampusDto campusDto)
        {
            var wordsToAnalyze = new List<string> { campusDto.Name };
            var axumResponse = await _uow.AxumService.AnalyzeWordsAsync(new AxumFilterRequest
            {
                Words = wordsToAnalyze
            });
            if (axumResponse?.IsInappropiate ?? true)
            {
                return BadRequest(axumResponse?.Message ?? "Hubo un error analizando el contenido de las palabras.");
            }
            var campus = await _uow.Campus.AddCampus(campusDto);
            if (campus == null)
            {
                return BadRequest();
            }
            await _uow.Save();

            return CreatedAtAction(
                nameof(GetCampus),
                new { id = campusDto.CampusId },
                campus
            );

        }

    }
}
