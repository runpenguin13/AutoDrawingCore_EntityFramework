using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoDrawing.Models.KJERPX
{
    [Table("dbo.X_Resource")]
    public partial class XResource
    {
        [Key]
        public int ResIdx { get; set; }
        public int AppIdx { get; set; }
        [StringLength(3)]
        public string AppCategory { get; set; }
        [StringLength(3)]
        public string FileCategory { get; set; }
        public string FileRemark { get; set; }
        public string FileVersion { get; set; }
        public string Url { get; set; }
        public int? IsUrl { get; set; }
        [StringLength(3)]
        public string SubCategory { get; set; }
        [StringLength(50)]
        public string Code { get; set; }
        [StringLength(50)]
        public string MDate { get; set; }
        public string Contents { get; set; }
        public DateTime? RDate { get; set; }
        [StringLength(50)]
        public string RUser { get; set; }
        public DateTime? EDate { get; set; }
        [StringLength(50)]
        public string EUser { get; set; }
    }
}
