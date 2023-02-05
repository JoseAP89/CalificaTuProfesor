using back_csharp._models;

namespace back_csharp._contracts;

public interface IRatingRepo
{
    Task<IEnumerable<Scale>> Example();
}
