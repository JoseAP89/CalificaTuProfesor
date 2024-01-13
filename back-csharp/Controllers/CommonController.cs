using AutoMapper;
using back_csharp._contracts;
using back_csharp._dtos;
using back_csharp._enums;
using back_csharp._models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace back_csharp.Controllers;

[Route("api/[controller]")]
[ApiController]
/*  This controller handles common functionality
 *  */
public class CommonController : ControllerBase
{

    public CommonController()
    {
    }

    [HttpGet("GenerateUserId")]
    public virtual async Task<Guid> GenerateUserId()
    {
        return await Task.Run( () => Guid.NewGuid());
    }
}
