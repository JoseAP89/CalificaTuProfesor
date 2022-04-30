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
            var universities = from uni in _context.Campuses
                orderby uni.Name select uni;
            var res = (await universities.Take(quantity).ToListAsync())?.Select( x => 
                new Vessel{Id = x.CampusId, Value = x.Name});
            if (res==null)
            {
                return NoContent();
            }
            return Ok(res);
        }
    }
}
