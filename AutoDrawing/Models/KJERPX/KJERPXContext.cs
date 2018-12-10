using System;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata;

namespace AutoDrawing.Models.KJERPX
{
    public partial class KJERPXContext : DbContext
    {
        public KJERPXContext()
        {
        }

        public KJERPXContext(DbContextOptions<KJERPXContext> options)
            : base(options)
        {
        }

        public virtual DbSet<XAppComponent> XAppComponents { get; set; }        
        public virtual DbSet<XCodeBook> XCodeBooks { get; set; }
        public virtual DbSet<XCompany> XCompanies { get; set; }
        public virtual DbSet<XComponent> XComponents { get; set; }
        public virtual DbSet<XContact> XContacts { get; set; }        
        public virtual DbSet<XEquipmentItem> XEquipmentItems { get; set; }
        public virtual DbSet<XFile> XFiles { get; set; }
        public virtual DbSet<XLibrary> XLibraries { get; set; }
        public virtual DbSet<XResource> XResources { get; set; }
        public virtual DbSet<XService> XServices { get; set; }
        public virtual DbSet<XServiceItem> XServiceItems { get; set; }
        public virtual DbSet<XVessel> XVessels { get; set; }
        public virtual DbSet<XFileRepository> XFileRepositories { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<XCodeBook>(entity =>
            {
                entity.HasKey(e => e.CodeIdx);

                entity.ToTable("X_CodeBook");

                entity.Property(e => e.CodeIdx).HasColumnName("codeIdx");

                entity.Property(e => e.CodeType)
                    .HasColumnName("codeType")
                    .HasMaxLength(3)
                    .IsUnicode(false);

                entity.Property(e => e.EDate)
                    .HasColumnName("eDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.EUser)
                    .HasColumnName("eUser")
                    .HasMaxLength(100);

                entity.Property(e => e.Icon)
                    .HasColumnName("icon")
                    .HasMaxLength(100);

                entity.Property(e => e.Name)
                    .HasColumnName("name")
                    .HasMaxLength(100)
                    .HasDefaultValueSql("(N'코드명')");

                entity.Property(e => e.RDate)
                    .HasColumnName("rDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.RUser)
                    .HasColumnName("rUser")
                    .HasMaxLength(100);

                entity.Property(e => e.Remark)
                    .HasColumnName("remark")
                    .HasMaxLength(2048);

                entity.Property(e => e.State).HasColumnName("state");

                entity.Property(e => e.ToLibrary).HasColumnName("toLibrary");

                entity.Property(e => e.Value)
                    .HasColumnName("value")
                    .HasMaxLength(100);
            });

            modelBuilder.Entity<XCompany>(entity =>
            {
                entity.HasKey(e => e.CompanyIdx);

                entity.ToTable("X_Company");

                entity.Property(e => e.CompanyIdx).HasColumnName("companyIdx");

                //entity.Property(e => e.Address).HasColumnName("address");

                entity.Property(e => e.Category)
                    .HasColumnName("category")
                    .HasMaxLength(100);

                //entity.Property(e => e.CeoName)
                //    .HasColumnName("ceoName")
                //    .HasMaxLength(512);

                entity.Property(e => e.CompanyCode)
                    .HasColumnName("companyCode")
                    .HasMaxLength(3)
                    .IsUnicode(false);

                entity.Property(e => e.CompanyName)
                    .HasColumnName("companyName")
                    .HasMaxLength(100);

                entity.Property(e => e.CompanySname)
                    .HasColumnName("companySName")
                    .HasMaxLength(100);

                //entity.Property(e => e.Country)
                //    .HasColumnName("country")
                //    .HasMaxLength(100);

                //entity.Property(e => e.DhlCode)
                //    .HasColumnName("dhlCode")
                //    .HasMaxLength(512);

                //entity.Property(e => e.EDate)
                //    .HasColumnName("eDate")
                //    .HasColumnType("datetime");

                //entity.Property(e => e.EUser)
                //    .HasColumnName("eUser")
                //    .HasMaxLength(100);

                //entity.Property(e => e.Email)
                //    .HasColumnName("email")
                //    .HasMaxLength(512);

                //entity.Property(e => e.Fax)
                //    .HasColumnName("fax")
                //    .HasMaxLength(60);

                //entity.Property(e => e.Geometry)
                //    .HasColumnName("geometry")
                //    .HasMaxLength(128);

                //entity.Property(e => e.PostCode)
                //    .HasColumnName("postCode")
                //    .HasMaxLength(512);

                //entity.Property(e => e.RDate)
                //    .HasColumnName("rDate")
                //    .HasColumnType("datetime");

                //entity.Property(e => e.RUser)
                //    .HasColumnName("rUser")
                //    .HasMaxLength(100);

                //entity.Property(e => e.RegisterNo)
                //    .HasColumnName("registerNo")
                //    .HasMaxLength(512);

                //entity.Property(e => e.Remark).HasColumnName("remark");

                //entity.Property(e => e.Social).HasColumnName("social");

                //entity.Property(e => e.State)
                //    .HasColumnName("state")
                //    .HasMaxLength(20);

                //entity.Property(e => e.Tag).HasColumnName("tag");

                //entity.Property(e => e.Tel)
                //    .HasColumnName("tel")
                //    .HasMaxLength(60);

                //entity.Property(e => e.Url)
                //    .HasColumnName("url")
                //    .HasMaxLength(510);
            });

            modelBuilder.Entity<XComponent>(entity =>
            {
                entity.HasKey(e => e.ComponentIdx);

                entity.ToTable("X_Component");

                entity.Property(e => e.ComponentIdx).HasColumnName("componentIdx");

                entity.Property(e => e.Barcode)
                    .HasColumnName("barcode")
                    .HasMaxLength(100);

                entity.Property(e => e.Cname)
                    .HasColumnName("cname")
                    .HasMaxLength(100)
                    .HasDefaultValueSql("('')");

                //entity.Property(e => e.Color)
                //    .HasColumnName("color")
                //    .HasMaxLength(100);

                entity.Property(e => e.CompGroupIdx).HasColumnName("compGroupIdx");

                entity.Property(e => e.CompTechGroupIdx).HasColumnName("compTechGroupIdx");

                entity.Property(e => e.CompanyIdx).HasColumnName("companyIdx");

                //entity.Property(e => e.Currency)
                //    .HasColumnName("currency")
                //    .HasMaxLength(6);

                //entity.Property(e => e.DiscountPrice).HasColumnName("discountPrice");

                entity.Property(e => e.EDate)
                    .HasColumnName("eDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.EUser)
                    .HasColumnName("eUser")
                    .HasMaxLength(100);

                entity.Property(e => e.Hscode)
                    .HasColumnName("HSCode")
                    .HasMaxLength(100);

                entity.Property(e => e.Ihm)
                    .HasColumnName("IHM")
                    .HasMaxLength(2)
                    .IsUnicode(false);

                //entity.Property(e => e.ImoNo).HasMaxLength(100);

                //entity.Property(e => e.IpGrade)
                //    .HasColumnName("ipGrade")
                //    .HasMaxLength(510);

                entity.Property(e => e.IsProduct).HasColumnName("isProduct");

                entity.Property(e => e.JrcorderCode)
                    .HasColumnName("JRCOrderCode")
                    .HasMaxLength(100);

                //entity.Property(e => e.ListPrice).HasColumnName("listPrice");

                entity.Property(e => e.Mass).HasMaxLength(100);

                entity.Property(e => e.Model)
                    .HasColumnName("model")
                    .HasMaxLength(100);

                entity.Property(e => e.Name)
                    .HasColumnName("name")
                    .HasMaxLength(100);

                //entity.Property(e => e.PurchasePrice).HasColumnName("purchasePrice");

                entity.Property(e => e.RDate)
                    .HasColumnName("rDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.RUser)
                    .HasColumnName("rUser")
                    .HasMaxLength(100);

                entity.Property(e => e.Remark).HasColumnName("remark");

                //entity.Property(e => e.Sficode)
                //    .HasColumnName("SFICode")
                //    .HasMaxLength(100);

                entity.Property(e => e.ShipdexCode)
                    .HasColumnName("shipdexCode")
                    .HasMaxLength(100);

                entity.Property(e => e.State)
                    .HasColumnName("state")
                    .HasMaxLength(20);

                entity.Property(e => e.Tag).HasColumnName("tag");

                entity.Property(e => e.Type)
                    .HasColumnName("type")
                    .HasMaxLength(510);

                entity.Property(e => e.Unit)
                    .HasColumnName("unit")
                    .HasMaxLength(100);

                //entity.Property(e => e.Volume)
                //    .HasColumnName("volume")
                //    .HasMaxLength(100);

                //entity.HasOne(d => d.CompGroupIdxNavigation)
                //    .WithMany(p => p.XComponentCompGroupIdxNavigation)
                //    .HasForeignKey(d => d.CompGroupIdx)
                //    .HasConstraintName("FK_X_Component_compGroupIdx");

                //entity.HasOne(d => d.CompTechGroupIdxNavigation)
                //    .WithMany(p => p.XComponentCompTechGroupIdxNavigation)
                //    .HasForeignKey(d => d.CompTechGroupIdx)
                //    .HasConstraintName("FK_X_Component_compTechGroupIdx");

                //entity.HasOne(d => d.CompanyIdxNavigation)
                //    .WithMany(p => p.XComponent)
                //    .HasForeignKey(d => d.CompanyIdx)
                //    .HasConstraintName("FK_X_Component_companyIdx");
            });

            modelBuilder.Entity<XContact>(entity =>
            {
                entity.HasKey(e => e.ContactIdx);

                entity.ToTable("X_Contact");

                entity.Property(e => e.ContactIdx).HasColumnName("contactIdx");

                entity.Property(e => e.CompanyIdx).HasColumnName("companyIdx");

                entity.Property(e => e.ContactName)
                    .HasColumnName("contactName")
                    .HasMaxLength(512);

                entity.Property(e => e.Dept)
                    .HasColumnName("dept")
                    .HasMaxLength(512);

                entity.Property(e => e.EDate)
                    .HasColumnName("eDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.EUser)
                    .HasColumnName("eUser")
                    .HasMaxLength(100);

                entity.Property(e => e.Email)
                    .HasColumnName("email")
                    .HasMaxLength(512);

                entity.Property(e => e.Mobile)
                    .HasColumnName("mobile")
                    .HasMaxLength(60);

                entity.Property(e => e.Position)
                    .HasColumnName("position")
                    .HasMaxLength(512);

                entity.Property(e => e.RDate)
                    .HasColumnName("rDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.RUser)
                    .HasColumnName("rUser")
                    .HasMaxLength(100);

                entity.Property(e => e.Remark).HasColumnName("remark");

                entity.Property(e => e.Sns).HasColumnName("sns");

                entity.Property(e => e.State).HasColumnName("state");

                entity.Property(e => e.Tag).HasColumnName("tag");

                entity.Property(e => e.Tel)
                    .HasColumnName("tel")
                    .HasMaxLength(60);

                //entity.HasOne(d => d.CompanyIdxNavigation)
                //    .WithMany(p => p.XContact)
                //    .HasForeignKey(d => d.CompanyIdx)
                //    .OnDelete(DeleteBehavior.ClientSetNull)
                //    .HasConstraintName("FK_X_Contact_companyIdx");
            });

            modelBuilder.Entity<XEquipmentItem>(entity =>
            {
                entity.HasKey(e => e.EquipmentItemIdx);

                entity.ToTable("X_EquipmentItem");

                entity.Property(e => e.EquipmentItemIdx).HasColumnName("equipmentItemIdx");

                entity.Property(e => e.ComponentIdx).HasColumnName("componentIdx");

                //entity.Property(e => e.DwApproveComment).HasColumnName("dwApproveComment");

                //entity.Property(e => e.DwApproveDate)
                //    .HasColumnName("dwApproveDate")
                //    .HasColumnType("datetime");

                //entity.Property(e => e.DwApproveState).HasColumnName("dwApproveState");

                //entity.Property(e => e.DwApproveUser)
                //    .HasColumnName("dwApproveUser")
                //    .HasMaxLength(100);

                //entity.Property(e => e.DwFinalComment).HasColumnName("dwFinalComment");

                //entity.Property(e => e.DwFinalDate)
                //    .HasColumnName("dwFinalDate")
                //    .HasColumnType("datetime");

                //entity.Property(e => e.DwFinalState).HasColumnName("dwFinalState");

                //entity.Property(e => e.DwFinalUser)
                //    .HasColumnName("dwFinalUser")
                //    .HasMaxLength(100);

                //entity.Property(e => e.DwOrder).HasColumnName("dwOrder");

                //entity.Property(e => e.DwWorkingComment).HasColumnName("dwWorkingComment");

                //entity.Property(e => e.DwWorkingDate)
                //    .HasColumnName("dwWorkingDate")
                //    .HasColumnType("datetime");

                //entity.Property(e => e.DwWorkingState).HasColumnName("dwWorkingState");

                //entity.Property(e => e.DwWorkingUser)
                //    .HasColumnName("dwWorkingUser")
                //    .HasMaxLength(100);

                //entity.Property(e => e.EDate)
                //    .HasColumnName("eDate")
                //    .HasColumnType("datetime");

                //entity.Property(e => e.EUser)
                //    .HasColumnName("eUser")
                //    .HasMaxLength(100);

                //entity.Property(e => e.ItemModel)
                //    .HasColumnName("itemModel")
                //    .HasMaxLength(100);

                //entity.Property(e => e.ItemName)
                //    .HasColumnName("itemName")
                //    .HasMaxLength(100);

                //entity.Property(e => e.ItemOrder).HasColumnName("itemOrder");

                //entity.Property(e => e.Leaf).HasColumnName("leaf");

                //entity.Property(e => e.ParentItemIdx).HasColumnName("parentItemIdx");

                //entity.Property(e => e.Price).HasColumnName("price");

                entity.Property(e => e.Qty).HasColumnName("qty");

                //entity.Property(e => e.RDate)
                //    .HasColumnName("rDate")
                //    .HasColumnType("datetime");

                //entity.Property(e => e.RUser)
                //    .HasColumnName("rUser")
                //    .HasMaxLength(100);

                //entity.Property(e => e.Remark).HasColumnName("remark");

                //entity.Property(e => e.SerialNo)
                //    .HasColumnName("serialNo")
                //    .HasMaxLength(240);

                //entity.Property(e => e.Tag).HasColumnName("tag");

                //entity.Property(e => e.Tax).HasColumnName("tax");

                //entity.Property(e => e.Total).HasColumnName("total");

                //entity.Property(e => e.UnitPrice).HasColumnName("unitPrice");

                entity.Property(e => e.VesselIdx).HasColumnName("vesselIdx");

                //entity.HasOne(d => d.ComponentIdxNavigation)
                //    .WithMany(p => p.XEquipmentItem)
                //    .HasForeignKey(d => d.ComponentIdx)
                //    .OnDelete(DeleteBehavior.Cascade)
                //    .HasConstraintName("FK_X_EquipmentItem_componentIdx");

                //entity.HasOne(d => d.VesselIdxNavigation)
                //    .WithMany(p => p.XEquipmentItem)
                //    .HasForeignKey(d => d.VesselIdx)
                //    .OnDelete(DeleteBehavior.Cascade)
                //    .HasConstraintName("FK_X_EquipmentItem_vesselIdx");
            });

            modelBuilder.Entity<XFile>(entity =>
            {
                entity.HasKey(e => e.FileIdx);

                entity.ToTable("X_File");

                entity.Property(e => e.FileIdx).HasColumnName("fileIdx");

                entity.Property(e => e.FileName)
                    .HasColumnName("fileName")
                    .HasMaxLength(2048);

                entity.Property(e => e.FilePath).HasColumnName("filePath");

                entity.Property(e => e.FileSize).HasColumnName("fileSize");

                entity.Property(e => e.FileUrl).HasColumnName("fileUrl");
            });

            modelBuilder.Entity<XLibrary>(entity =>
            {
                entity.HasKey(e => e.LibIdx);

                entity.ToTable("X_Library");

                entity.Property(e => e.LibIdx).HasColumnName("libIdx");

                entity.Property(e => e.ComponentModels).HasColumnName("componentModels");

                entity.Property(e => e.EDate)
                    .HasColumnName("eDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.EUser)
                    .HasColumnName("eUser")
                    .HasMaxLength(50)
                    .IsUnicode(false);

                entity.Property(e => e.GroupNames).HasColumnName("groupNames");

                entity.Property(e => e.RDate)
                    .HasColumnName("rDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.RUser)
                    .HasColumnName("rUser")
                    .HasMaxLength(50)
                    .IsUnicode(false);
            });

            modelBuilder.Entity<XResource>(entity =>
            {
                entity.HasKey(e => e.ResIdx);

                entity.ToTable("X_Resource");

                entity.HasIndex(e => new { e.AppIdx, e.AppCategory })
                    .HasName("IDX_X_Resource_AppIdx_AppCategory");

                entity.Property(e => e.ResIdx).HasColumnName("resIdx");

                entity.Property(e => e.AppCategory)
                    .IsRequired()
                    .HasColumnName("appCategory")
                    .HasMaxLength(3)
                    .IsUnicode(false);

                entity.Property(e => e.AppIdx).HasColumnName("appIdx");

                entity.Property(e => e.Code)
                    .HasColumnName("code")
                    .HasMaxLength(100);

                entity.Property(e => e.Contents)
                    .HasColumnName("contents")
                    .HasColumnType("xml");

                entity.Property(e => e.EDate)
                    .HasColumnName("eDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.EUser)
                    .HasColumnName("eUser")
                    .HasMaxLength(100);

                entity.Property(e => e.FileCategory)
                    .HasColumnName("fileCategory")
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .HasDefaultValueSql("((0))");

                entity.Property(e => e.FileRemark).HasColumnName("fileRemark");

                entity.Property(e => e.FileVersion).HasColumnName("fileVersion");

                entity.Property(e => e.IsUrl).HasColumnName("isUrl");

                entity.Property(e => e.MDate)
                    .HasColumnName("mDate")
                    .HasMaxLength(100);

                entity.Property(e => e.RDate)
                    .HasColumnName("rDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.RUser)
                    .HasColumnName("rUser")
                    .HasMaxLength(100);

                entity.Property(e => e.SubCategory)
                    .HasColumnName("subCategory")
                    .HasMaxLength(3)
                    .IsUnicode(false)
                    .HasDefaultValueSql("('')");

                entity.Property(e => e.Url).HasColumnName("url");
            });

            modelBuilder.Entity<XService>(entity =>
            {
                entity.HasKey(e => e.ServiceIdx);

                entity.ToTable("X_Service");

                entity.Property(e => e.ServiceIdx).HasColumnName("serviceIdx");

                entity.Property(e => e.AssignedContactIdx).HasColumnName("assignedContactIdx");

                entity.Property(e => e.ContactIdx).HasColumnName("contactIdx");

                entity.Property(e => e.Currency)
                    .HasColumnName("currency")
                    .HasMaxLength(3)
                    .IsUnicode(false);

                entity.Property(e => e.DocNo)
                    .HasColumnName("docNo")
                    .HasMaxLength(510);

                entity.Property(e => e.EDate)
                    .HasColumnName("eDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.EUser)
                    .HasColumnName("eUser")
                    .HasMaxLength(100);

                entity.Property(e => e.FromCompanyIdx).HasColumnName("fromCompanyIdx");

                entity.Property(e => e.IsTemp).HasColumnName("isTemp");

                entity.Property(e => e.LocalCompanyIdx).HasColumnName("localCompanyIdx");

                entity.Property(e => e.LocalContactIdx).HasColumnName("localContactIdx");

                entity.Property(e => e.Location)
                    .HasColumnName("location")
                    .HasMaxLength(256);

                entity.Property(e => e.Payment)
                    .HasColumnName("payment")
                    .HasMaxLength(2048);

                entity.Property(e => e.PoNo)
                    .HasColumnName("poNo")
                    .HasMaxLength(510);

                entity.Property(e => e.Price).HasColumnName("price");

                entity.Property(e => e.PriceLocked).HasColumnName("priceLocked");

                entity.Property(e => e.ProposeCategory)
                    .HasColumnName("proposeCategory")
                    .HasMaxLength(20);

                entity.Property(e => e.RDate)
                    .HasColumnName("rDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.RUser)
                    .HasColumnName("rUser")
                    .HasMaxLength(100);

                entity.Property(e => e.Remark).HasColumnName("remark");

                entity.Property(e => e.RequestDate)
                    .HasColumnName("requestDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.SaleCategory).HasColumnName("saleCategory");

                entity.Property(e => e.ServiceCategory).HasColumnName("serviceCategory");

                entity.Property(e => e.ServiceEdate)
                    .HasColumnName("serviceEDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.ServiceEtaport)
                    .HasColumnName("serviceETAPort")
                    .HasMaxLength(510);

                entity.Property(e => e.ServiceEtdport)
                    .HasColumnName("serviceETDPort")
                    .HasMaxLength(510);

                entity.Property(e => e.ServiceOrder).HasColumnName("serviceOrder");

                entity.Property(e => e.ServiceReport).HasColumnName("serviceReport");

                entity.Property(e => e.ServiceSdate)
                    .HasColumnName("serviceSDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.ServiceType).HasColumnName("serviceType");

                entity.Property(e => e.State)
                    .HasColumnName("state")
                    .HasMaxLength(20);

                entity.Property(e => e.Tag).HasColumnName("tag");

                entity.Property(e => e.Tax).HasColumnName("tax");

                entity.Property(e => e.Title)
                    .HasColumnName("title")
                    .HasMaxLength(510);

                entity.Property(e => e.ToCompanyIdx).HasColumnName("toCompanyIdx");

                entity.Property(e => e.Total).HasColumnName("total");

                entity.Property(e => e.Ver)
                    .HasColumnName("ver")
                    .HasMaxLength(32);

                entity.Property(e => e.VesselEta)
                    .HasColumnName("vesselETA")
                    .HasColumnType("datetime");

                entity.Property(e => e.VesselEtd)
                    .HasColumnName("vesselETD")
                    .HasColumnType("datetime");

                entity.Property(e => e.VesselIdx).HasColumnName("vesselIdx");

                entity.Property(e => e.WorkerCompanyIdx).HasColumnName("workerCompanyIdx");

                entity.Property(e => e.WorkerContactIdx).HasColumnName("workerContactIdx");

                //entity.HasOne(d => d.AssignedContactIdxNavigation)
                //    .WithMany(p => p.XServiceAssignedContactIdxNavigation)
                //    .HasForeignKey(d => d.AssignedContactIdx)
                //    .HasConstraintName("FK_X_Service_assignedContactIdx");

                //entity.HasOne(d => d.ContactIdxNavigation)
                //    .WithMany(p => p.XServiceContactIdxNavigation)
                //    .HasForeignKey(d => d.ContactIdx)
                //    .HasConstraintName("FK_X_Service_contactIdx");

                //entity.HasOne(d => d.FromCompanyIdxNavigation)
                //    .WithMany(p => p.XServiceFromCompanyIdxNavigation)
                //    .HasForeignKey(d => d.FromCompanyIdx)
                //    .HasConstraintName("FK_X_Service_fromCompanyIdx");

                //entity.HasOne(d => d.LocalCompanyIdxNavigation)
                //    .WithMany(p => p.XServiceLocalCompanyIdxNavigation)
                //    .HasForeignKey(d => d.LocalCompanyIdx)
                //    .HasConstraintName("FK_X_Service_localCompanyIdx");

                //entity.HasOne(d => d.LocalContactIdxNavigation)
                //    .WithMany(p => p.XServiceLocalContactIdxNavigation)
                //    .HasForeignKey(d => d.LocalContactIdx)
                //    .HasConstraintName("FK_X_Service_localContactIdx");

                //entity.HasOne(d => d.ToCompanyIdxNavigation)
                //    .WithMany(p => p.XServiceToCompanyIdxNavigation)
                //    .HasForeignKey(d => d.ToCompanyIdx)
                //    .HasConstraintName("FK_X_Service_toCompanyIdx");

                //entity.HasOne(d => d.WorkerCompanyIdxNavigation)
                //    .WithMany(p => p.XServiceWorkerCompanyIdxNavigation)
                //    .HasForeignKey(d => d.WorkerCompanyIdx)
                //    .HasConstraintName("FK_X_Service_workerCompanyIdx");

                //entity.HasOne(d => d.WorkerContactIdxNavigation)
                //    .WithMany(p => p.XServiceWorkerContactIdxNavigation)
                //    .HasForeignKey(d => d.WorkerContactIdx)
                //    .HasConstraintName("FK_X_Service_workerContactIdx");
            });

            modelBuilder.Entity<XServiceItem>(entity =>
            {
                entity.HasKey(e => e.ServiceItemIdx);

                entity.ToTable("X_ServiceItem");

                entity.Property(e => e.ServiceItemIdx).HasColumnName("serviceItemIdx");

                entity.Property(e => e.ComponentIdx).HasColumnName("componentIdx");

                entity.Property(e => e.DrawingComment).HasColumnName("drawingComment");

                entity.Property(e => e.DrawingDate)
                    .HasColumnName("drawingDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.DrawingState).HasColumnName("drawingState");

                entity.Property(e => e.DrawingUser)
                    .HasColumnName("drawingUser")
                    .HasMaxLength(100);

                entity.Property(e => e.EDate)
                    .HasColumnName("eDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.EUser)
                    .HasColumnName("eUser")
                    .HasMaxLength(100);

                entity.Property(e => e.EquipmentItemIdx).HasColumnName("equipmentItemIdx");

                entity.Property(e => e.ItemModel)
                    .HasColumnName("itemModel")
                    .HasMaxLength(100);

                entity.Property(e => e.ItemName)
                    .HasColumnName("itemName")
                    .HasMaxLength(100);

                entity.Property(e => e.ItemOrder).HasColumnName("itemOrder");

                entity.Property(e => e.Leaf).HasColumnName("leaf");

                entity.Property(e => e.Note).HasColumnName("note");

                entity.Property(e => e.ParentItemIdx).HasColumnName("parentItemIdx");

                entity.Property(e => e.Price).HasColumnName("price");

                entity.Property(e => e.Qty).HasColumnName("qty");

                entity.Property(e => e.RDate)
                    .HasColumnName("rDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.RUser)
                    .HasColumnName("rUser")
                    .HasMaxLength(100);

                entity.Property(e => e.Remark).HasColumnName("remark");

                entity.Property(e => e.SerialNo)
                    .HasColumnName("serialNo")
                    .HasMaxLength(64);

                entity.Property(e => e.ServiceIdx).HasColumnName("serviceIdx");

                entity.Property(e => e.ServiceReportIdx).HasColumnName("serviceReportIdx");

                entity.Property(e => e.Specification).HasColumnName("specification");

                entity.Property(e => e.Tag).HasColumnName("tag");

                entity.Property(e => e.Tax).HasColumnName("tax");

                entity.Property(e => e.Total).HasColumnName("total");

                entity.Property(e => e.UnitPrice).HasColumnName("unitPrice");

                //entity.HasOne(d => d.ComponentIdxNavigation)
                //    .WithMany(p => p.XServiceItem)
                //    .HasForeignKey(d => d.ComponentIdx)
                //    .OnDelete(DeleteBehavior.Cascade)
                //    .HasConstraintName("FK_X_ServiceItem_componentIdx");

                //entity.HasOne(d => d.ServiceIdxNavigation)
                //    .WithMany(p => p.XServiceItem)
                //    .HasForeignKey(d => d.ServiceIdx)
                //    .OnDelete(DeleteBehavior.Cascade)
                //    .HasConstraintName("FK_X_ServiceItem_serviceIdx");
            });
           

            modelBuilder.Entity<XVessel>(entity =>
            {
                entity.HasKey(e => e.VesselIdx);

                entity.ToTable("X_Vessel");

                entity.Property(e => e.VesselIdx)
                    .HasColumnName("vesselIdx")
                    .ValueGeneratedOnAdd();

                entity.Property(e => e.Bam)
                    .HasColumnName("bam")
                    .HasMaxLength(20);

                entity.Property(e => e.BuiltYear)
                    .HasColumnName("builtYear")
                    .HasMaxLength(8);

                entity.Property(e => e.CallSign).HasMaxLength(100);

                entity.Property(e => e.Class).HasMaxLength(510);

                entity.Property(e => e.Class2).HasMaxLength(510);

                entity.Property(e => e.DeliveryDate)
                    .HasColumnName("deliveryDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.DesignCompanyIdx).HasColumnName("designCompanyIdx");

                entity.Property(e => e.EDate)
                    .HasColumnName("eDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.EUser)
                    .HasColumnName("eUser")
                    .HasMaxLength(100);

                entity.Property(e => e.FirstVessel).HasMaxLength(100);

                entity.Property(e => e.Flag).HasMaxLength(40);

                entity.Property(e => e.Gmdss)
                    .HasColumnName("gmdss")
                    .HasMaxLength(100);

                entity.Property(e => e.GrossTonnage).HasMaxLength(100);

                entity.Property(e => e.HullCode).HasMaxLength(100);

                entity.Property(e => e.HullName).HasMaxLength(100);

                entity.Property(e => e.ImoNo).HasMaxLength(100);

                entity.Property(e => e.JrcSalesNo).HasMaxLength(60);

                entity.Property(e => e.KeelLaying)
                    .HasColumnName("keelLaying")
                    .HasColumnType("datetime");

                entity.Property(e => e.Kind).HasMaxLength(40);

                entity.Property(e => e.Mmsi)
                    .HasColumnName("MMSI")
                    .HasMaxLength(100);

                entity.Property(e => e.Notation).HasMaxLength(510);

                entity.Property(e => e.Notation2).HasMaxLength(510);

                entity.Property(e => e.Notation3).HasMaxLength(510);

                entity.Property(e => e.Notation4).HasMaxLength(510);

                entity.Property(e => e.OfficialNo).HasMaxLength(100);

                entity.Property(e => e.OwnerCompanyIdx).HasColumnName("ownerCompanyIdx");

                entity.Property(e => e.PortOfRegistry).HasMaxLength(100);

                entity.Property(e => e.ProjectOrSeries).HasMaxLength(100);

                entity.Property(e => e.RDate)
                    .HasColumnName("rDate")
                    .HasColumnType("datetime");

                entity.Property(e => e.RUser)
                    .HasColumnName("rUser")
                    .HasMaxLength(100);

                entity.Property(e => e.Rms)
                    .HasColumnName("rms")
                    .HasMaxLength(10);

                entity.Property(e => e.SeaTrial)
                    .HasColumnName("seaTrial")
                    .HasColumnType("datetime");

                entity.Property(e => e.Size).HasMaxLength(40);

                entity.Property(e => e.State)
                    .HasColumnName("state")
                    .HasMaxLength(20);

                entity.Property(e => e.Survey).HasMaxLength(510);

                entity.Property(e => e.Survey2).HasMaxLength(510);

                entity.Property(e => e.Tag).HasColumnName("tag");

                entity.Property(e => e.VesselCode)
                    .HasColumnName("vesselCode")
                    .HasMaxLength(4)
                    .IsUnicode(false);

                entity.Property(e => e.YardCompanyIdx).HasColumnName("yardCompanyIdx");

                //entity.HasOne(d => d.VesselIdxNavigation)
                //    .WithOne(p => p.InverseVesselIdxNavigation)
                //    .HasForeignKey<XVessel>(d => d.VesselIdx)
                //    .OnDelete(DeleteBehavior.ClientSetNull)
                //    .HasConstraintName("FK_X_Vessel_X_Vessel");
            });

            modelBuilder.Entity<XAppComponent>(entity =>
            {
                entity.HasKey(e => e.AppIdx);

                entity.ToTable("X_AppComponent");

                entity.Property(e => e.AppCategory).HasColumnName("appCategory");
                entity.Property(e => e.ComponentIdx).HasColumnName("componentIdx");
            });

            modelBuilder.Entity<XFileRepository>(entity =>
            {
                entity.HasKey(e => e.FileIdx);

                entity.ToTable("X_FileRepository");

                entity.Property(e => e.AppIdx).HasColumnName("appIdx");
                entity.Property(e => e.AppCategory).HasColumnName("appCategory");
            });

        }
    }
}
