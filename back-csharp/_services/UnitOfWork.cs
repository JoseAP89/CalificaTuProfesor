using back_csharp._contracts;
using back_csharp._data;
using back_csharp._repos;
using Microsoft.EntityFrameworkCore;

namespace back_csharp._services;

public class UnitOfWork: IUnitOfWork
{
    private readonly DbContext _context;
    private IUniversityRepo _universities;
    private IStateRepo _states;

    public UnitOfWork(TeachersContext context)
    {
        _context = context;
    }

    public IUniversityRepo Universities => _universities ??= new UniversityRepo(_context);
    public IStateRepo States => _states ??= new StateRepo(_context);

    public async Task Save()
    {
        await _context.SaveChangesAsync();
    }
}