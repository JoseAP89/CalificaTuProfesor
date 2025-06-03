using back_csharp._models;

namespace back_csharp._contracts;

public interface IUnitOfWork
{
    IUniversityRepo Universities { get; }
    IStateRepo States { get; }
    IUniversityAreaRepo UniversityAreas { get; }
    ICampusRepo Campus { get; }
    IRosterRepo Roster { get; }
    IScaleRepo Scale { get; }
    IRatingRepo Ratings { get; }
    IVoteRepo Votes { get; }
    IAxumService AxumService { get; }   
    Task Save();
}