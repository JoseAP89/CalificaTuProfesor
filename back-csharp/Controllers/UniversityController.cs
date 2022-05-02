using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.IO;
using System.Text;
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
        private readonly TeachersContext _context;

        public UniversityController(TeachersContext context)
        {
            _context = context;
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<IEnumerable<UniversityDto>>> GetUniversity(int id)
        {
            try
            {
                var universities = from uni in _context.Universities 
                    where uni.UniversityId==id select uni;
                if (universities==null)
                {
                    return NoContent();
                }
                return Ok(await universities.AsNoTracking().SingleAsync());
            }
            catch (Exception e)
            {
                Console.WriteLine(e);
                return BadRequest($"Hubo un error al buscar la universidad con id {id}");
            }

        }
        
        [HttpGet]
        public async Task<ActionResult<IEnumerable<UniversityDto>>> GetUniversities()
        {
            var universities = from uni in _context.Universities 
                orderby uni.Name select uni;
            if (universities==null)
            {
                return NoContent();
            }

            return Ok(await universities.AsNoTracking().ToListAsync());

        }
        
        [HttpPost]
        public async Task<ActionResult<IEnumerable<UniversityDto>>> AddUniversity(UniversityDto universitydto)
        {
            try
            {
                var university = new University
                {
                    UniversityId = 0,
                    Name = universitydto.Name.Trim().ToUpper()
                };
                if (universitydto.ImgFile != null)
                {
                    string img_name = universitydto.Name.Replace(" ", "_").ToLower().Trim();
                    string path = "/home/joseap/Documents/projects/CalificaTuProfesor/front/public/universities/";
                    path += img_name + "." + universitydto.ImgType;
                    var data = universitydto.ImgFile.Base64Decode();
                    System.IO.File.WriteAllBytesAsync(path,data);
                }
                
                _context.Universities.Add(university);
                await _context.SaveChangesAsync();

                return CreatedAtAction(
                    nameof(GetUniversity),
                    new { id = universitydto.UniversityId},
                    universitydto
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
