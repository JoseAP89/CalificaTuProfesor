using back_csharp._data;

namespace back_csharp._contracts;

public interface IUnitOfWork
{
    IUniversityRepo Universities { get; }
    IStateRepo States { get; }
    IUniStructureRepo UniStructures { get; }
    Task Save();
}