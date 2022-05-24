using System.Linq.Expressions;
using back_csharp._contracts;
using back_csharp._data;
using Microsoft.EntityFrameworkCore;

namespace back_csharp._repos;

public class CommonRepo<T>: ICommonRepo<T>
    where T: class
{

    protected DbContext _context;

    public CommonRepo(DbContext context)
    {
        _context = context;
    }

    public virtual async Task Add(T entity)
    {
        await _context.Set<T>().AddAsync(entity);
    }

    public virtual async Task Update(T entity)
    {
        _context.Set<T>().Update(entity);
    }

    public virtual async Task Delete(int id)
    {
        var data = await _context.Set<T>().FindAsync(id);
        if (data!= null)
        {
            _context.Set<T>().Remove(data);
        }
    }

    public virtual async Task<T> GetById(int id)
    {
        return await _context.Set<T>().FindAsync(id);
    }

    public virtual async Task<IEnumerable<T>> GetAll<E>(Expression<Func<T,E>>? exp = null, int? numOfResults = null)
    {
        var data =  _context.Set<T>().AsNoTracking();
        IEnumerable<T> results = (exp != null, numOfResults != null) switch
        {
            (false, false) => await data.ToListAsync(),
            (true, false) => await data.OrderBy(exp).ToListAsync(),
            (false, true) => await data.Take((int)numOfResults).ToListAsync(),
            (true, true) => await data.Take((int)numOfResults).OrderBy(exp).ToListAsync()
        };
        return results;
    }

    public virtual async Task<IEnumerable<T>> Find(Expression<Func<T, bool>> exp)
    {
        return await _context.Set<T>().Where(exp).ToListAsync();
    }
}