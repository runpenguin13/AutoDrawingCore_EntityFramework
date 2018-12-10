using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoDrawing.Models.KJERPX
{
    [Table("dbo.X_Library")]
    public partial class XLibrary
    {
        [Key]
        public int LibIdx { get; set; }
        public string ComponentModels { get; set; }
        public string GroupNames { get; set; }
        public DateTime? RDate { get; set; }
        [StringLength(50)]
        public string RUser { get; set; }
        public DateTime? EDate { get; set; }
        [StringLength(50)]
        public string EUser { get; set; }
    }
}
