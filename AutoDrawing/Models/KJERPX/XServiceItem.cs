using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoDrawing.Models.KJERPX
{
    [Table("dbo.X_ServiceItem")]
    public partial class XServiceItem
    {
        [Key]
        public int ServiceItemIdx { get; set; }
        public int? ServiceIdx { get; set; }
        public int? ComponentIdx { get; set; }
        public int? EquipmentItemIdx { get; set; }
        [StringLength(64)]
        public string SerialNo { get; set; }
        public int? ServiceReportIdx { get; set; }
        public double? Qty { get; set; }
        public decimal? UnitPrice { get; set; }
        public decimal? Price { get; set; }
        public decimal? Tax { get; set; }
        public decimal? Total { get; set; }
        public DateTime? RDate { get; set; }
        [StringLength(100)]
        public string RUser { get; set; }
        public DateTime? EDate { get; set; }
        [StringLength(100)]
        public string EUser { get; set; }
        public string Remark { get; set; }
        public string Tag { get; set; }
        public int? ItemOrder { get; set; }
        public string Note { get; set; }
        public string Specification { get; set; }
        [StringLength(100)]
        public string ItemName { get; set; }
        public int? ParentItemIdx { get; set; }
        public int? Leaf { get; set; }
        [StringLength(100)]
        public string ItemModel { get; set; }
        public int? DrawingState { get; set; }
        public DateTime? DrawingDate { get; set; }
        public string DrawingComment { get; set; }
        public string DrawingUser { get; set; }

        [ForeignKey("ComponentIdx")]
        public XComponent Component { get; set; }
        public XService Service { get; set; }
    }
}
