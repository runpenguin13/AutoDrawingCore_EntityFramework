using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoDrawing.Models.DrawingDemo
{
    [Table("Equipment", Schema = "Production")]
    public partial class Equipment
    {
        public Equipment()
        {
            DrawingEquipments = new HashSet<DrawingEquipment>();
            Products = new HashSet<Product>();
        }

        public int Id { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string Name { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string Desc { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string FormalName { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string Group { get; set; }
        public DateTime? Date { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string User { get; set; }

        public virtual ICollection<DrawingEquipment> DrawingEquipments { get; set; }
        public virtual ICollection<Product> Products { get; set; }
    }
}
