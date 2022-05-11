using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace back_csharp._data
{
    public partial class teachersContext : DbContext
    {
        public teachersContext()
        {
        }

        public teachersContext(DbContextOptions<teachersContext> options)
            : base(options)
        {
        }

        public virtual DbSet<Campus> Campuses { get; set; } = null!;
        public virtual DbSet<Comment> Comments { get; set; } = null!;
        public virtual DbSet<Grade> Grades { get; set; } = null!;
        public virtual DbSet<Roster> Rosters { get; set; } = null!;
        public virtual DbSet<Scale> Scales { get; set; } = null!;
        public virtual DbSet<State> States { get; set; } = null!;
        public virtual DbSet<UniStructure> UniStructures { get; set; } = null!;
        public virtual DbSet<University> Universities { get; set; } = null!;
        public virtual DbSet<Vote> Votes { get; set; } = null!;

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            if (!optionsBuilder.IsConfigured)
            {
#warning To protect potentially sensitive information in your connection string, you should move it out of source code. You can avoid scaffolding the connection string by using the Name= syntax to read it from configuration - see https://go.microsoft.com/fwlink/?linkid=2131148. For more guidance on storing connection strings, see http://go.microsoft.com/fwlink/?LinkId=723263.
                optionsBuilder.UseNpgsql("Host=localhost;Username=joseap;Password=J1o2s3e4;Database=teachers");
            }
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.HasPostgresExtension("unaccent");

            modelBuilder.Entity<Campus>(entity =>
            {
                entity.ToTable("campus");

                entity.HasIndex(e => new { e.Name, e.UniversityId, e.StateId }, "campus_name_university_id_state_id_key")
                    .IsUnique();

                entity.Property(e => e.CampusId).HasColumnName("campus_id");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasColumnName("created_at")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasColumnName("modified_at");

                entity.Property(e => e.Name)
                    .HasMaxLength(250)
                    .HasColumnName("name");

                entity.Property(e => e.StateId).HasColumnName("state_id");

                entity.Property(e => e.UniversityId).HasColumnName("university_id");

                entity.HasOne(d => d.State)
                    .WithMany(p => p.Campuses)
                    .HasForeignKey(d => d.StateId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("campus_state_id_fkey");

                entity.HasOne(d => d.University)
                    .WithMany(p => p.Campuses)
                    .HasForeignKey(d => d.UniversityId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("campus_university_id_fkey");
            });

            modelBuilder.Entity<Comment>(entity =>
            {
                entity.ToTable("comment");

                entity.Property(e => e.CommentId).HasColumnName("comment_id");

                entity.Property(e => e.Comment1)
                    .HasMaxLength(250)
                    .HasColumnName("comment");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasColumnName("created_at")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasColumnName("modified_at");

                entity.Property(e => e.RosterId).HasColumnName("roster_id");

                entity.Property(e => e.TokenId)
                    .HasMaxLength(40)
                    .HasColumnName("token_id");

                entity.HasOne(d => d.Roster)
                    .WithMany(p => p.Comments)
                    .HasForeignKey(d => d.RosterId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("comment_roster_id_fkey");
            });

            modelBuilder.Entity<Grade>(entity =>
            {
                entity.ToTable("grade");

                entity.Property(e => e.GradeId).HasColumnName("grade_id");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasColumnName("created_at")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasColumnName("modified_at");

                entity.Property(e => e.RosterId).HasColumnName("roster_id");

                entity.Property(e => e.ScaleId).HasColumnName("scale_id");

                entity.Property(e => e.Stars)
                    .HasColumnName("stars")
                    .HasDefaultValueSql("0");

                entity.Property(e => e.TokenId)
                    .HasMaxLength(20)
                    .HasColumnName("token_id");

                entity.HasOne(d => d.Roster)
                    .WithMany(p => p.Grades)
                    .HasForeignKey(d => d.RosterId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("grade_roster_id_fkey");

                entity.HasOne(d => d.Scale)
                    .WithMany(p => p.Grades)
                    .HasForeignKey(d => d.ScaleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("grade_scale_id_fkey");
            });

            modelBuilder.Entity<Roster>(entity =>
            {
                entity.ToTable("roster");

                entity.HasIndex(e => new { e.CampusId, e.TeacherName, e.TeacherLastname1, e.TeacherLastname2, e.SubjectName }, "roster_campus_id_teacher_name_teacher_lastname1_teacher_las_key")
                    .IsUnique();

                entity.Property(e => e.RosterId).HasColumnName("roster_id");

                entity.Property(e => e.CampusId).HasColumnName("campus_id");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasColumnName("created_at")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasColumnName("modified_at");

                entity.Property(e => e.StructureName)
                    .HasMaxLength(100)
                    .HasColumnName("structure_name");

                entity.Property(e => e.SubjectName)
                    .HasMaxLength(100)
                    .HasColumnName("subject_name");

                entity.Property(e => e.TeacherLastname1)
                    .HasMaxLength(100)
                    .HasColumnName("teacher_lastname1");

                entity.Property(e => e.TeacherLastname2)
                    .HasMaxLength(100)
                    .HasColumnName("teacher_lastname2");

                entity.Property(e => e.TeacherName)
                    .HasMaxLength(100)
                    .HasColumnName("teacher_name");

                entity.Property(e => e.UniStructureId).HasColumnName("uni_structure_id");

                entity.HasOne(d => d.Campus)
                    .WithMany(p => p.Rosters)
                    .HasForeignKey(d => d.CampusId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("roster_campus_id_fkey");

                entity.HasOne(d => d.UniStructure)
                    .WithMany(p => p.Rosters)
                    .HasForeignKey(d => d.UniStructureId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("roster_uni_structure_id_fkey");
            });

            modelBuilder.Entity<Scale>(entity =>
            {
                entity.ToTable("scale");

                entity.Property(e => e.ScaleId).HasColumnName("scale_id");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasColumnName("created_at")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.Description)
                    .HasMaxLength(250)
                    .HasColumnName("description");

                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasColumnName("modified_at");

                entity.Property(e => e.Name)
                    .HasMaxLength(30)
                    .HasColumnName("name");
            });

            modelBuilder.Entity<State>(entity =>
            {
                entity.ToTable("state");

                entity.Property(e => e.StateId).HasColumnName("state_id");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasColumnName("created_at")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasColumnName("modified_at");

                entity.Property(e => e.Name)
                    .HasMaxLength(80)
                    .HasColumnName("name");
            });

            modelBuilder.Entity<UniStructure>(entity =>
            {
                entity.ToTable("uni_structure");

                entity.Property(e => e.UniStructureId).HasColumnName("uni_structure_id");

                entity.Property(e => e.Code)
                    .HasMaxLength(2)
                    .HasColumnName("code");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasColumnName("created_at")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasColumnName("modified_at");

                entity.Property(e => e.Name)
                    .HasMaxLength(300)
                    .HasColumnName("name");
            });

            modelBuilder.Entity<University>(entity =>
            {
                entity.ToTable("university");

                entity.HasIndex(e => e.Name, "university_name_key")
                    .IsUnique();

                entity.Property(e => e.UniversityId).HasColumnName("university_id");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasColumnName("created_at")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasColumnName("modified_at");

                entity.Property(e => e.Name)
                    .HasMaxLength(250)
                    .HasColumnName("name");
            });

            modelBuilder.Entity<Vote>(entity =>
            {
                entity.ToTable("vote");

                entity.Property(e => e.VoteId).HasColumnName("vote_id");

                entity.Property(e => e.Approval).HasColumnName("approval");

                entity.Property(e => e.CommentId).HasColumnName("comment_id");

                entity.Property(e => e.CreatedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasColumnName("created_at")
                    .HasDefaultValueSql("now()");

                entity.Property(e => e.ModifiedAt)
                    .HasColumnType("timestamp without time zone")
                    .HasColumnName("modified_at");

                entity.Property(e => e.TokenId)
                    .HasMaxLength(40)
                    .HasColumnName("token_id");

                entity.HasOne(d => d.Comment)
                    .WithMany(p => p.Votes)
                    .HasForeignKey(d => d.CommentId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("vote_comment_id_fkey");
            });

            OnModelCreatingPartial(modelBuilder);
        }

        partial void OnModelCreatingPartial(ModelBuilder modelBuilder);
    }
}
