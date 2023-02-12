namespace back_csharp._dtos;

public class TableData<T>
{
    public List<T> Data { get; set; }
    public int TotalElements { get; set; }
    public int PageNumber { get; set; }
    public int PageSize { get; set; }
}
