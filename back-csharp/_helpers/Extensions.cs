using System.Drawing;

namespace back_csharp._helpers;
using System.Text;
using System.Globalization;

public static class Extensions
{
    /// <summary>
    /// Removes all diacritics from a string.
    /// </summary>
    public static string RemoveDiacritics(this string text) 
    {
        var normalizedString = text.Normalize(NormalizationForm.FormD);
        var stringBuilder = new StringBuilder(capacity: normalizedString.Length);

        for (int i = 0; i < normalizedString.Length; i++)
        {
            char c = normalizedString[i];
            var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
            if (unicodeCategory != UnicodeCategory.NonSpacingMark)
            {
                stringBuilder.Append(c);
            }
        }

        return stringBuilder
            .ToString()
            .Normalize(NormalizationForm.FormC);
    }

    public static byte[] Base64Decode(this string data) {
        if (data == null)
        {
            return default;
        }
        var base64EncodedBytes = System.Convert.FromBase64String(data);
        return base64EncodedBytes;
    }
    
}