using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoDrawing.Models.KJERPX
{
    [Table("dbo.X_Component")]
    public partial class XComponent
    {
        public XComponent()
        {
            XAppComponents = new HashSet<XAppComponent>();
            //XEquipmentItems = new HashSet<XEquipmentItem>();
            XServiceItems = new HashSet<XServiceItem>();
        }

        [Key]
        public int ComponentIdx { get; set; }
        [StringLength(100)]
        public string Name { get; set; }
        public int? CompanyIdx { get; set; }
        [StringLength(100)]
        public string Model { get; set; }
        [StringLength(510)]
        public string Type { get; set; }
        public int? CompGroupIdx { get; set; }
        [StringLength(100)]
        public string Unit { get; set; }
        [StringLength(100)]
        public string Barcode { get; set; }
        public int? IsProduct { get; set; }
        [StringLength(100)]
        public string JrcorderCode { get; set; }
        [StringLength(100)]
        public string Hscode { get; set; }
        [StringLength(2)]
        public string Ihm { get; set; }
        [StringLength(100)]
        public string ShipdexCode { get; set; }
        public string Remark { get; set; }
        public DateTime? RDate { get; set; }
        [StringLength(100)]
        public string RUser { get; set; }
        public DateTime? EDate { get; set; }
        [StringLength(100)]
        public string EUser { get; set; }
        [StringLength(20)]
        public string State { get; set; }
        [StringLength(100)]
        public string Mass { get; set; }
        public string Tag { get; set; }        
        public int? CompTechGroupIdx { get; set; }
        [StringLength(100)]
        public string Cname { get; set; }

        public ICollection<XAppComponent> XAppComponents { get; set; }
        public ICollection<XServiceItem> XServiceItems { get; set; }
    }
}