using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoDrawing.Models.DrawingDemo
{
    [Table("Equipment", Schema = "Drawing")]
    public partial class DrawingEquipment
    {
        public DrawingEquipment()
        {
            Configurations = new HashSet<Configuration>();
            Diagrams = new HashSet<Diagram>();
            FileList = new HashSet<FileList>();
        }

        public int Id { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string EquipmentName { get; set; }
        public int? Quantity { get; set; }
        [Column(TypeName = "nvarchar(255)")]
        public string FileName { get; set; }
        public int? DrawingOrderId { get; set; }
        public int? ProductId { get; set; }
        public int? EquipmentId { get; set; }
        [Column(TypeName = "nvarchar(50)")]
        public string Modifier { get; set; }
        public int? ServiceItemIdx { get; set; }
        [Column(TypeName = "nvarchar(5)")]
        public string Group { get; set; }

        public DrawingOrder DrawingOrder { get; set; }
        //public Equipment EquipmentNavigation { get; set; }
        //public DrawingEquipment IdNavigation { get; set; }
        public Product Product { get; set; }
        //public DrawingEquipment DrawingEquipment { get; set; }
        public ICollection<Configuration> Configurations { get; set; }
        public ICollection<Diagram> Diagrams { get; set; }
        public ICollection<FileList> FileList { get; set; }
    }
}
