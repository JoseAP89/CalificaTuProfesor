using System.Linq.Expressions;
using back_csharp._contracts;
using back_csharp._data;
using Microsoft.EntityFrameworkCore;

namespace back_csharp._repos;

public class CommonRepo<T>: ICommonRepo<T>
    where T: class
{

    private DbContext _contex;

    public CommonRepo(DbContext contex)
    {
        _contex = contex;
    }

    public virtual async Task Add(T entity)
    {
        await _contex.Set<T>().AddAsync(entity);
    }

    public virtual async Task Update(T entity)
    {
        _contex.Set<T>().Update(entity);
    }

    public virtual async Task Delete(int id)
    {
        var data = await _contex.Set<T>().FindAsync(id);
        if (data!= null)
        {
            _contex.Set<T>().Remove(data);
        }
    }

    public virtual async Task<T> GetById(int id)
    {
        return await _contex.Set<T>().FindAsync(id);
    }

    public virtual async Task<IEnumerable<T>> GetAll<E>(Expression<Func<T,E>>? exp = null, int? numOfResults = null)
    {
        var data =  _contex.Set<T>().AsNoTracking();
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
        return await _contex.Set<T>().Where(exp).ToListAsync();
    }
}