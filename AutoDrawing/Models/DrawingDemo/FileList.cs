using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;

namespace AutoDrawing.Models.DrawingDemo
{
    [Table("FileList", Schema = "Drawing")]
    public partial class FileList
    {
        public int Id { get; set; }
        public int? DwgEquipId { get; set; }
        public string FileName { get; set; }
        [Column(TypeName = "nvarchar(20)")]
        public string FileType { get; set; }
        public string SaveName { get; set; }
        public int? DrawingOrderId { get; set; }
        [Column(TypeName = "nvarchar(5)")]
        public string Group { get; set; }

        public DrawingOrder DrawingOrder { get; set; }
        public DrawingEquipment DwgEquip { get; set; }
    }
}
