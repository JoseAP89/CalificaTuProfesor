namespace back_csharp._contracts;

public interface IUnitOfWork
{
    IUniversityRepo Universities { get; }
    Task Save();
}