using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoDrawing.Models.KJERPX
{
    [Table("dbo.X_Contact")]
    public partial class XContact
    {
        public XContact()
        {
            
        }

        [Key]
        public int ContactIdx { get; set; }
        public int CompanyIdx { get; set; }
        [StringLength(512)]
        public string ContactName { get; set; }
        [StringLength(512)]
        public string Dept { get; set; }
        [StringLength(512)]
        public string Position { get; set; }
        [StringLength(60)]
        public string Tel { get; set; }
        [StringLength(60)]
        public string Mobile { get; set; }
        [StringLength(512)]
        public string Email { get; set; }
        public string Sns { get; set; }
        public string Remark { get; set; }
        public int? State { get; set; }
        public DateTime? RDate { get; set; }
        [StringLength(100)]
        public string RUser { get; set; }
        public DateTime? EDate { get; set; }
        [StringLength(100)]
        public string EUser { get; set; }
        public string Tag { get; set; }
    }
}
