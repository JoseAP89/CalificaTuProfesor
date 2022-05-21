using back_csharp._contracts;
using back_csharp._data;
using back_csharp._repos;
using Microsoft.EntityFrameworkCore;

namespace back_csharp._services;

public class UnitOfWork: IUnitOfWork
{
    private DbContext _context;
    public IUniversityRepo _unirepo;

    public UnitOfWork(TeachersContext context)
    {
        _context = context;
    }

    public IUniversityRepo Universities
    {
        get
        {
            // ReSharper disable once ConvertIfStatementToNullCoalescingExpression
            if (_unirepo == null)
            {
                _unirepo = new UniversityRepo(_context);
            }
            return _unirepo;
        }
    }

    public Task Save()
    {
        throw new NotImplementedException();
    }
}