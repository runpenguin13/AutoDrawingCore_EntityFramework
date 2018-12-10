using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoDrawing.Models.KJERPX
{
    [Table("dbo.X_Company")]
    public partial class XCompany
    {
        public XCompany()
        {
        }

        [Key]
        public int CompanyIdx { get; set; }
        [StringLength(100)]
        public string CompanyName { get; set; }
        [StringLength(3)]
        public string CompanyCode { get; set; }
        [StringLength(100)]
        public string Category { get; set; }
        [StringLength(100)]
        public string CompanySname { get; set; }
    }
}
