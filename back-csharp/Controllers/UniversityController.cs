using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Text;
using back_csharp._contracts;
using Microsoft.AspNetCore.Mvc;
using back_csharp._data;
using back_csharp._dtos;
using back_csharp._helpers;
using Microsoft.EntityFrameworkCore;
using AutoMapper;

namespace back_csharp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UniversityController : ControllerBase
    {
        private readonly IUnitOfWork _uow;
        private readonly IMapper _mapper;

        public UniversityController(IUnitOfWork uow, TeachersContext context, IMapper mapper)
        {
            _uow = uow;
            _mapper = mapper;
        }


        [HttpGet("{id:int}")]
        public async Task<ActionResult<IEnumerable<UniversityDto>>> GetUniversity(int id)
        {
            var university = await _uow.Universities.GetById(id);
            if (university == null)
            {
                return NoContent();
            }
            return Ok(university);
        }

        [HttpGet("all/{numOfResults?}")]
        public async Task<ActionResult<IEnumerable<UniversityDto>>> GetUniversities(int? numOfResults)
        {
            var universities = await _uow.Universities.GetAll(x => x.Name, numOfResults);
            if (universities == null)
            {
                return NoContent();
            }
            return Ok(universities);
        }

        [HttpGet("search/{search}")]
        public async Task<ActionResult<IEnumerable<Vessel>>> GetUniversitySearch(string search)
        {
            var res = await _uow.Universities.Search(search);
            if (res==null)
            {
                return BadRequest("There was an error while searching the university.");
            }
            return Ok(res);
        }
        
        [HttpPost]
        public async Task<ActionResult<UniversityDto>> AddUniversity(UniversityDto universitydto)
        {
            var wordsToAnalyze = new List<string> { universitydto.Name };
            var axumResponse = await _uow.AxumService.AnalyzeWordsAsync(new AxumFilterRequest
            {
                Words = wordsToAnalyze
            });
            if (axumResponse?.IsInappropiate ?? true)
            {
                return BadRequest(axumResponse?.Message ?? "Hubo un error analizando el contenido de las palabras.");
            }
            var university = await _uow.Universities.Add(universitydto);
            await _uow.Universities.AddImage(universitydto);
            await _uow.Save();
            return CreatedAtAction(
                nameof(GetUniversity),
                new { id = universitydto.UniversityId },
                university
            );
        }
    }
}
