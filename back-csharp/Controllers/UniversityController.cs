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

namespace back_csharp.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UniversityController : ControllerBase
    {
        private readonly IUnitOfWork _uow;
        private readonly TeachersContext _context;

        public UniversityController(IUnitOfWork uow, TeachersContext context)
        {
            _uow = uow;
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<UniversityDto>>> GetUniversity(int id)
        {
            try
            {
                var university = await _uow.Universities.GetById(id);
                if (university==null)
                {
                    return NoContent();
                }
                return Ok(university);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest($"Hubo un error al buscar la universidad con id {id}");
            }

        }
        
        [HttpGet("all/{numOfResults?}")]
        public async Task<ActionResult<IEnumerable<UniversityDto>>> GetUniversities(int? numOfResults)
        {
            try
            {
                var universities = await _uow.Universities.GetAll(x => x.Name, numOfResults);
                if (universities==null)
                {
                    return NoContent();
                }
                return Ok(universities);
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest($"Hubo un error al buscar todas las universidades.");
            }
        }
        
        [HttpGet("search/{search}")]
        public async Task<ActionResult<IEnumerable<Vessel>>> GetUniversitySearch(string search)
        {
            try
            {
                var res = await _uow.Universities.Search(search);
                if (res==null)
                {
                    return NoContent();
                }
                return Ok(res);

            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest($"Hubo un error al buscar las universidades.");
            }
        }
        
        [HttpPost]
        public async Task<ActionResult<IEnumerable<UniversityDto>>> AddUniversity(UniversityDto universitydto)
        {
            try
            {
                var university = await _uow.Universities.Add(universitydto);
                _uow.Universities.AddImage(universitydto);
                await _uow.Save();
                return CreatedAtAction(
                    nameof(GetUniversity),
                    new { id = universitydto.UniversityId},
                    university
                );
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest($"Hubo un error al agregar la univeridad {universitydto.Name}.");
            }

        }
    }
}
