using System.Linq.Expressions;

namespace back_csharp._contracts;

public interface ICommonRepo<T> 
    where T: class
{
    Task Add(T entity);
    void Update(T entity);
    Task Delete(int id);
    Task<T> GetById(int id);
    Task<IEnumerable<T>> GetAll<E>(Expression<Func<T,E>> orderBy, int? numOfResults);
    Task<IEnumerable<T>> Find(Expression<Func<T, bool>> exp);
}