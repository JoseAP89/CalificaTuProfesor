using back_csharp._models;
using back_csharp._dtos;

namespace back_csharp._contracts;

public interface IUniversityRepo: ICommonRepo<University>
{
    Task<IEnumerable<Vessel>> Search(string text);
    Task<University> Add(UniversityDto entitydto);
    Task AddImage(UniversityDto data);
}