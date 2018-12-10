using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoDrawing.Models.DrawingDemo
{
    [Table("Product", Schema ="Production")]
    public partial class Product
    {
        public Product()
        {
            DrawingEquipments = new HashSet<DrawingEquipment>();
            Variants = new HashSet<Variant>();
            Children = new HashSet<Variant>();
            VisioMaps = new HashSet<VisioMap>();
            WordMaps = new HashSet<WordMap>();
        }

        public int Id { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string Model { get; set; }
        public string Title { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string Completion { get; set; }
        public int? EquipmentId { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string Mass { get; set; }
        public int? ComponentIdx { get; set; }
        public int? State { get; set; }
        [Column(TypeName = "nvarchar(5)")]
        public string Group { get; set; }
        public int? TableCol { get; set; }
        public DateTime? Date { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string User { get; set; }
        public double? LeftIndent { get; set; }

        public virtual Equipment Equipment { get; set; }
        public virtual ICollection<DrawingEquipment> DrawingEquipments { get; set; }
        public virtual ICollection<Variant> Variants { get; set; }
        public virtual ICollection<Variant> Children { get; set; }
        public virtual ICollection<VisioMap> VisioMaps { get; set; }
        public virtual ICollection<WordMap> WordMaps { get; set; }
    }
}
