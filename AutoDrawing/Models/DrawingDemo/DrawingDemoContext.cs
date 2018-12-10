using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace AutoDrawing.Models.DrawingDemo
{
    public partial class DrawingDemoContext : DbContext
    {
        public DrawingDemoContext()
        {
        }

        public DrawingDemoContext(DbContextOptions<DrawingDemoContext> options)
            : base(options)
        {
        }

        public string[] ConsoleOfGMDSS = { "Separate", "JRC", "MRC" };
        public string[] BAM = { "true", "false" };
        public string[] RMS = { "true", "false" };
        public string[] PlacingPerson = { "H.Sakai", "M.Ito", "R.Nishimori", "Y.Tsuji", "S.Hayashi", "K.Ichihara", "M.Nagai" };
        public string[] ReceivePerson = { "JW.Kim", "MG.Choi", "JH.Lee" };

        public string[] PowerSource = { "AC220V", "AC100V", "AC110V" };
        public int[] State = { 0, 1 };


        public virtual DbSet<AspNetRoles> AspNetRoles { get; set; }
        public virtual DbSet<AspNetUserClaims> AspNetUserClaims { get; set; }
        public virtual DbSet<AspNetUserLogins> AspNetUserLogins { get; set; }
        public virtual DbSet<AspNetUserRoles> AspNetUserRoles { get; set; }
        public virtual DbSet<AspNetUsers> AspNetUsers { get; set; }
        public virtual DbSet<Code> Codes { get; set; }
        public virtual DbSet<Configuration> Configurations { get; set; }
        public virtual DbSet<Diagram> Diagrams { get; set; }
        public virtual DbSet<DrawingOrder> DrawingOrders { get; set; }
        public virtual DbSet<Entity> Entities { get; set; }
        public virtual DbSet<DrawingEquipment> DrawingEquipments { get; set; }
        public virtual DbSet<Equipment> Equipments { get; set; }
        public virtual DbSet<FileList> FileList { get; set; }
        public virtual DbSet<Log> Logs { get; set; }
        public virtual DbSet<MigrationHistory> MigrationHistory { get; set; }
        public virtual DbSet<Product> Products { get; set; }
        public virtual DbSet<RelationShape> RelationShapes { get; set; }
        public virtual DbSet<RelationVisiomap> RelationVisiomaps { get; set; }
        public virtual DbSet<Shape> Shapes { get; set; }
        public virtual DbSet<Variant> Variants { get; set; }
        public virtual DbSet<VisioMap> VisioMaps { get; set; }
        public virtual DbSet<WordMap> WordMaps { get; set; }


        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // 기본 스키마 지정
            modelBuilder.HasDefaultSchema("dbo");


            #region AspNetUser
            modelBuilder.Entity<AspNetRoles>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasMaxLength(128)
                    .ValueGeneratedNever();

                entity.Property(e => e.Discriminator).HasMaxLength(128);

                entity.Property(e => e.Name).HasMaxLength(256);

                entity.HasOne(d => d.IdNavigation)
                    .WithOne(p => p.InverseIdNavigation)
                    .HasForeignKey<AspNetRoles>(d => d.Id)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AspNetRoles_AspNetRoles");
            });

            modelBuilder.Entity<AspNetUserClaims>(entity =>
            {
                entity.Property(e => e.UserId)
                    .IsRequired()
                    .HasMaxLength(128);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserClaims)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_dbo.AspNetUserClaims_dbo.AspNetUsers_UserId");
            });

            modelBuilder.Entity<AspNetUserLogins>(entity =>
            {
                entity.HasKey(e => new { e.LoginProvider, e.ProviderKey, e.UserId });

                entity.Property(e => e.LoginProvider).HasMaxLength(128);

                entity.Property(e => e.ProviderKey).HasMaxLength(128);

                entity.Property(e => e.UserId).HasMaxLength(128);

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserLogins)
                    .HasForeignKey(d => d.UserId)
                    .HasConstraintName("FK_dbo.AspNetUserLogins_dbo.AspNetUsers_UserId");
            });

            modelBuilder.Entity<AspNetUserRoles>(entity =>
            {
                entity.HasKey(e => new { e.UserId, e.RoleId });

                entity.Property(e => e.UserId).HasMaxLength(128);

                entity.Property(e => e.RoleId).HasMaxLength(128);

                entity.HasOne(d => d.Role)
                    .WithMany(p => p.AspNetUserRoles)
                    .HasForeignKey(d => d.RoleId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AspNetUserRoles_AspNetRoles");

                entity.HasOne(d => d.User)
                    .WithMany(p => p.AspNetUserRoles)
                    .HasForeignKey(d => d.UserId)
                    .OnDelete(DeleteBehavior.ClientSetNull)
                    .HasConstraintName("FK_AspNetUserRoles_AspNetUsers");
            });

            modelBuilder.Entity<AspNetUsers>(entity =>
            {
                entity.Property(e => e.Id)
                    .HasMaxLength(128)
                    .ValueGeneratedNever();

                entity.Property(e => e.Email).HasMaxLength(256);

                entity.Property(e => e.LockoutEndDateUtc).HasColumnType("datetime");

                entity.Property(e => e.UserName)
                    .IsRequired()
                    .HasMaxLength(256);
            });
            #endregion


            #region Models
            modelBuilder.Entity<Variant>(entity =>
            {
                entity.HasOne(d => d.Parent)
                    .WithMany(p => p.Children)
                    .HasForeignKey(d => d.ParentId)
                    .HasConstraintName("FK_Variant_Product");

                entity.HasOne(d => d.Product)
                    .WithMany(p => p.Variants)
                    .HasForeignKey(d => d.ProductId)
                    .HasConstraintName("FK_Variant_Product1");

                entity.HasOne(d => d.Code)
                    .WithMany(p => p.Variants)
                    .HasForeignKey(d => d.VariantGroup);
            });

            modelBuilder.Entity<Configuration>(entity =>
            {
                entity.HasOne(d => d.DwgEquipment)
                    .WithMany(p => p.Configurations)
                    .HasForeignKey(d => d.DwgEquipmentId)
                    .HasConstraintName("FK_Configuration_Equipment");

                entity.HasOne(d => d.Variant)
                    .WithMany(p => p.Configurations)
                    .HasForeignKey(d => d.VariantId)
                    .HasConstraintName("FK_Configuration_Configuration");
            });

            modelBuilder.Entity<Diagram>(entity =>
            {
                entity.HasOne(d => d.Drawing)
                    .WithMany(p => p.Diagrams)
                    .HasForeignKey(d => d.DrawingId)
                    .HasConstraintName("FK_Drawing_Diagram_DrawingId");

                entity.HasOne(d => d.Parent)
                    .WithMany(p => p.Notations)
                    .HasForeignKey(d => d.ParentId)
                    .HasConstraintName("FK_Drawing_Diagram_ParentId");

                entity.HasOne(d => d.Shape)
                    .WithMany(p => p.Diagrams)
                    .HasForeignKey(d => d.ShapeId)
                    .HasConstraintName("FK_Diagram_Shape");

                entity.HasOne(d => d.VisioMap)
                    .WithMany(p => p.Diagrams)
                    .HasForeignKey(d => d.VisioMapId)
                    .HasConstraintName("FK_Drawing_Diagram_LayerId");

                entity.HasOne(d => d.WordMap)
                    .WithMany(p => p.Diagrams)
                    .HasForeignKey(d => d.WordMapId)
                    .HasConstraintName("FK_Drawing_Diagram_VisioId");
            });

            modelBuilder.Entity<DrawingOrder>(entity =>
            {
                entity.Property(e => e.Id).ValueGeneratedOnAdd();

                //entity.HasOne(d => d.IdNavigation)
                //    .WithOne(p => p.InverseIdNavigation)
                //    .HasForeignKey<DrawingOrder>(d => d.Id)
                //    .OnDelete(DeleteBehavior.ClientSetNull)
                //    .HasConstraintName("FK_DrawingOrder_DrawingOrder");
            });

            modelBuilder.Entity<DrawingEquipment>(entity =>
            {
                entity.Property(e => e.Quantity).HasDefaultValueSql("((0))");

                entity.HasOne(d => d.DrawingOrder)
                    .WithMany(p => p.DrawingEquipments)
                    .HasForeignKey(d => d.DrawingOrderId)
                    .HasConstraintName("FK_Drawing_DrawingEquipment_DrawingOrder");

                //entity.HasOne(d => d.EquipmentNavigation)
                //    .WithMany(p => p.DrawingEquipments)
                //    .HasForeignKey(d => d.EquipmentId)
                //    .HasConstraintName("FK_Drawing_Equipment_Equipment");

                //entity.HasOne(d => d.IdNavigation)
                //    .WithOne(p => p.InverseIdNavigation)
                //    .HasForeignKey<DrawingEquipment>(d => d.Id)
                //    .OnDelete(DeleteBehavior.ClientSetNull)
                //    .HasConstraintName("FK_Equipment_Equipment");

                //entity.HasOne(d => d.Product)
                //    .WithMany(p => p.DrawingEquipments)
                //    .HasForeignKey(d => d.ProductId)
                //    .HasConstraintName("FK_Drawing_Equipment_Product");
            });

            modelBuilder.Entity<Equipment>()
                .HasMany(e => e.Products)
                .WithOne()
                .HasForeignKey(e => e.EquipmentId);

            modelBuilder.Entity<FileList>(entity =>
            {
                entity.HasOne(d => d.DrawingOrder)
                    .WithMany(p => p.FileList)
                    .HasForeignKey(d => d.DrawingOrderId)
                    .HasConstraintName("FK_FileList_DrawingOrder");

                entity.HasOne(d => d.DwgEquip)
                    .WithMany(p => p.FileList)
                    .HasForeignKey(d => d.DwgEquipId)
                    .HasConstraintName("FK_FileList_Equipment");
            });

            modelBuilder.Entity<MigrationHistory>(entity =>
            {
                entity.HasKey(e => new { e.MigrationId, e.ContextKey });

                entity.ToTable("__MigrationHistory");

                entity.Property(e => e.MigrationId).HasMaxLength(150);

                entity.Property(e => e.ContextKey).HasMaxLength(300);

                entity.Property(e => e.Model).IsRequired();

                entity.Property(e => e.ProductVersion)
                    .IsRequired()
                    .HasMaxLength(32);
            });

            modelBuilder.Entity<Product>(entity =>
            {
                entity.HasOne(d => d.Equipment)
                    .WithMany(p => p.Products)
                    .HasForeignKey(d => d.EquipmentId)
                    .HasConstraintName("FK_Production_Product_Equipment");

                //entity.HasMany(b => b.Children).WithOne();
            });

            modelBuilder.Entity<RelationShape>(entity =>
            {
                entity.HasOne(d => d.ReShape)
                    .WithMany(p => p.RelationShapes)
                    .HasForeignKey(d => d.ReShapeId)
                    .HasConstraintName("FK_RelationShape_Shape1");

                entity.HasOne(d => d.Shape)
                    .WithMany(p => p.ChildrenShapes)
                    .HasForeignKey(d => d.ShapeId)
                    .HasConstraintName("FK_RelationShape_Shape");
            });

            modelBuilder.Entity<Shape>(entity =>
            {
                entity.HasOne(d => d.VisioMap)
                    .WithMany(p => p.Shapes)
                    .HasForeignKey(d => d.VisioMapId)
                    .HasConstraintName("FK_Shape_VisioMap");
            });



            modelBuilder.Entity<VisioMap>(entity =>
            {
                entity.HasOne(d => d.Product)
                    .WithMany(p => p.VisioMaps)
                    .HasForeignKey(d => d.ProductId)
                    .HasConstraintName("FK_Drawing_VisioMap_ProductId");

                entity.HasOne(d => d.WordMap)
                    .WithMany(p => p.VisioMaps)
                    .HasForeignKey(d => d.WordMapId)
                    .HasConstraintName("FK_VisioMap_WordMapId");
            });

            modelBuilder.Entity<WordMap>(entity =>
            {
                entity.HasOne(d => d.Product)
                    .WithMany(p => p.WordMaps)
                    .HasForeignKey(d => d.ProductId)
                    .HasConstraintName("FK_Drawing_WordMap_Product");

                entity.HasOne(d => d.Variant)
                    .WithMany(p => p.WordMaps)
                    .HasForeignKey(d => d.VariantId)
                    .HasConstraintName("FK_Drawing_WordMap_Variant");
            });
            #endregion
        }
    }
}
