using back_csharp._models;

namespace back_csharp._contracts;

public interface IUnitOfWork
{
    IUniversityRepo Universities { get; }
    IStateRepo States { get; }
    IUniStructureRepo UniStructures { get; }
    ICampusRepo Campus { get; }
    IRosterRepo Roster { get; }
    IScaleRepo Scale { get; }
    Task Save();
}