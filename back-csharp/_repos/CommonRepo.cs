using System.Linq.Expressions;
using back_csharp._contracts;
using back_csharp._data;
using Microsoft.EntityFrameworkCore;

namespace back_csharp._repos;

public class CommonRepo<T>: ICommonRepo<T>
    where T: class
{

    protected readonly TeachersContext _context;
    protected readonly DbSet<T> _dbset;
    protected readonly IConfiguration _config; 
    protected const int MAX_RESULTS = 20;

    public CommonRepo(TeachersContext context, IConfiguration config)
    {
        _context = context;
        _config = config;
        _dbset = context.Set<T>();
    }
    
    public virtual async Task Add(T entity)
    {
        await _dbset.AddAsync(entity);
    }

    public virtual void Update(T entity)
    {
        _dbset.Attach(entity);
        _context.Entry(entity).State = EntityState.Modified;
    }

    public virtual async Task Delete(int id)
    {
        var data = await _context.Set<T>().FindAsync(id);
        if (data!= null)
        {
            _dbset.Remove(data);
        }
    }

    public virtual async Task<T> GetById(int id)
    {
        return await _dbset.FindAsync(id);
    }

    public virtual async Task<IEnumerable<T>> GetAll<E>(Expression<Func<T,E>> orderBy = null, int? numOfResults = null)
    {
        var data =  _dbset.AsNoTracking();
        IEnumerable<T> results = (orderBy != null, numOfResults != null) switch
        {
            (false, false) => await data.ToListAsync(),
            (true, false) => await data.OrderBy(orderBy).ToListAsync(),
            (false, true) => await data.Take((int)numOfResults).ToListAsync(),
            (true, true) => await data.Take((int)numOfResults).OrderBy(orderBy).ToListAsync()
        };
        return results;
    }

    public virtual async Task<IEnumerable<T>> Find(Expression<Func<T, bool>> exp)
    {
        return await _dbset.Where(exp).ToListAsync();
    }

}