using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoDrawing.Models.KJERPX
{
    [Table("dbo.X_CodeBook")]
    public partial class XCodeBook
    {
        [Key]
        public int CodeIdx { get; set; }
        [StringLength(3)]
        public string CodeType { get; set; }
        [StringLength(100)]
        public string Name { get; set; }
        [StringLength(100)]
        public string Value { get; set; }
        [StringLength(2048)]
        public string Remark { get; set; }
        public int? State { get; set; }
        public DateTime? RDate { get; set; }
        [StringLength(100)]
        public string RUser { get; set; }
        public DateTime? EDate { get; set; }
        [StringLength(100)]
        public string EUser { get; set; }
        [StringLength(100)]
        public string Icon { get; set; }
        public int? ToLibrary { get; set; }
    }
}
