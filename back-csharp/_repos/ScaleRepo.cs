using back_csharp._contracts;
using back_csharp._models;
using back_csharp._dtos;
using Microsoft.EntityFrameworkCore;
using back_csharp._data;

namespace back_csharp._repos;

public class ScaleRepo: CommonRepo<Scale>, IScaleRepo
{
    public ScaleRepo(TeachersContext context, IConfiguration config) : base(context, config)
    {
    }

    public async Task<IEnumerable<Scale>> GetAll()
    {
        var scales = (await base.GetAll<Scale>(null, null))
            ?.OrderBy( s => s.Name);
        return scales.ToList();
    }
}