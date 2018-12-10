using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoDrawing.Models.KJERPX
{
    [Table("dbo.X_Service")]
    public partial class XService
    {
        public XService()
        {
        }

        [Key]
        public int ServiceIdx { get; set; }
        public int? VesselIdx { get; set; }
        [StringLength(510)]
        public string Title { get; set; }
        public int? SaleCategory { get; set; }
        public int? ServiceType { get; set; }
        public int? ServiceCategory { get; set; }
        [StringLength(510)]
        public string PoNo { get; set; }
        [StringLength(510)]
        public string DocNo { get; set; }
        public DateTime? ServiceSdate { get; set; }
        public DateTime? ServiceEdate { get; set; }
        public DateTime? RequestDate { get; set; }
        [StringLength(2048)]
        public string Payment { get; set; }
        [StringLength(3)]
        public string Currency { get; set; }
        public int? ContactIdx { get; set; }
        public int? AssignedContactIdx { get; set; }
        public int? WorkerContactIdx { get; set; }
        public int? WorkerCompanyIdx { get; set; }
        public decimal? Price { get; set; }
        public decimal? Tax { get; set; }
        public decimal? Total { get; set; }
        public int? FromCompanyIdx { get; set; }
        public int? ToCompanyIdx { get; set; }
        [StringLength(20)]
        public string State { get; set; }
        public string Remark { get; set; }
        public DateTime? RDate { get; set; }
        [StringLength(100)]
        public string RUser { get; set; }
        public DateTime? EDate { get; set; }
        [StringLength(100)]
        public string EUser { get; set; }
        public int? PriceLocked { get; set; }
        public string Tag { get; set; }
        public string ServiceReport { get; set; }
        public string ServiceOrder { get; set; }
        public DateTime? VesselEta { get; set; }
        public DateTime? VesselEtd { get; set; }
        [StringLength(256)]
        public string Location { get; set; }
        public int? LocalContactIdx { get; set; }
        public int? LocalCompanyIdx { get; set; }
        [StringLength(510)]
        public string ServiceEtaport { get; set; }
        [StringLength(510)]
        public string ServiceEtdport { get; set; }
        public int? IsTemp { get; set; }
        [StringLength(20)]
        public string ProposeCategory { get; set; }
        [StringLength(32)]
        public string Ver { get; set; }

        public ICollection<XServiceItem> XServiceItems { get; set; }
        public XVessel Vessel { get; set; }
    }
}
