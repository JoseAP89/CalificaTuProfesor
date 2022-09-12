using back_csharp._contracts;
using back_csharp._data;
using back_csharp._dtos;
using Microsoft.EntityFrameworkCore;

namespace back_csharp._repos;

public class ScaleRepo: CommonRepo<Scale>, IScaleRepo
{
    public ScaleRepo(DbContext context, IConfiguration config) : base(context, config)
    {
    }

    public async Task<IEnumerable<Scale>> GetAll()
    {
        var scales = await base.GetAll<Scale>(null, null);
        return scales.ToList();
    }
}