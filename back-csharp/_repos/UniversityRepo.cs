using back_csharp._contracts;
using back_csharp._data;
using Microsoft.EntityFrameworkCore;

namespace back_csharp._repos;

public class UniversityRepo: CommonRepo<University>, IUniversityRepo
{
    public UniversityRepo(DbContext ctx): base(ctx)
    {
        
    }
}