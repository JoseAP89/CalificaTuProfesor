using System.Drawing;

namespace back_csharp._helpers;
using System.Text;
using System.Globalization;
using back_csharp._dtos;

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

    public static FullCommentDTO ConvertToFullCommentDTO(this FullCommentDB comment)
    {
        var commentDTO = new FullCommentDTO();
        commentDTO.Comment = new CommentDTO();
        commentDTO.Comment.CommentId = comment.CommentCommentid;
        commentDTO.Comment.RosterId = comment.CommentRosterid;
        commentDTO.Comment.Content = comment.CommentContent;
        commentDTO.Comment.TokenId = comment.CommentTokenid;
        commentDTO.Comment.RecordId = comment.CommentRecordid.ToString();
        commentDTO.Comment.SubjectName = comment.CommentSubjectname;
        // GRADE
        commentDTO.Grade = new GradeDTO();
        commentDTO.Grade.GradeId = comment.GradeGradeid;
        commentDTO.Grade.ScaleId  = comment.GradeScaleid;
        commentDTO.Grade.CommentId  = comment.GradeCommentid;
        commentDTO.Grade.Stars  = comment.GradeStars;
        // SCALE
        commentDTO.Scale = new ScaleDTO();
        commentDTO.Scale.ScaleId = comment.ScaleScaleid;
        commentDTO.Scale.Code  = comment.ScaleCode;
        commentDTO.Scale.Name  = comment.ScaleName;
        commentDTO.Scale.Description  = comment.ScaleDescription;
        // VOTE
        commentDTO.Vote = new VoteDTO();
        commentDTO.Vote.VoteId = comment.VoteVoteid; 
        commentDTO.Vote.CommentId = comment.VoteCommentid; 
        commentDTO.Vote.Approval = comment.VoteApproval; 
        commentDTO.Vote.Likes = comment.VoteLikes; 
        commentDTO.Vote.Dislikes = comment.VoteDislikes; 
        return commentDTO;
    }

}