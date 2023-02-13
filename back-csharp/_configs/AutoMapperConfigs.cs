using AutoMapper;
using back_csharp._models;
using back_csharp._dtos;

namespace back_csharp._configs;

public class AutoMapperConfigs: Profile
{
    public AutoMapperConfigs()
    {
        // ***
        CreateMap<Vote, VoteDTO>();
        CreateMap<VoteDTO, Vote>();
        // ***
        CreateMap<Campus, CampusDto>().ReverseMap();
        CreateMap<Campus, ShortCampusDTO>().ReverseMap();
        CreateMap<CampusDto, ShortCampusDTO>().ReverseMap();
        CreateMap<ScaleDTO, Scale>().ReverseMap();
        CreateMap<Grade, GradeDTO>().ReverseMap();
        CreateMap<Comment, CommentDTO>().ReverseMap();
    }
}