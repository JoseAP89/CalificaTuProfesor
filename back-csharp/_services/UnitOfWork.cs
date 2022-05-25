using back_csharp._contracts;
using back_csharp._data;
using back_csharp._repos;
using Microsoft.EntityFrameworkCore;

namespace back_csharp._services;

public class UnitOfWork: IUnitOfWork
{
    private readonly DbContext _context;
    private IUniversityRepo _universities;

    public UnitOfWork(TeachersContext context)
    {
        _context = context;
    }


    public IUniversityRepo Universities => _universities ??= new UniversityRepo(_context);

    public async Task Save()
    {
        await _context.SaveChangesAsync();
    }
}