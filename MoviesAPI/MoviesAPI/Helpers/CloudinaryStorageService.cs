//using CloudinaryDotNet.Actions;
//using CloudinaryDotNet;
//using Microsoft.AspNetCore.Http;
//using System.IO;
//using System.Threading.Tasks;
//using System;

//namespace MoviesAPI.Helpers
//{
//    public class CloudinaryStorageService
//    {
//    }
//}
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.AspNetCore.Http;
using Microsoft.Extensions.Configuration;
using System;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace MoviesAPI.Helpers
{
    public class CloudinaryStorageService : IFileStorageService
    {
        private readonly Cloudinary cloudinary;

        public CloudinaryStorageService(IConfiguration configuration)
        {
            var account = new Account(
      configuration["Cloudinary:CloudName"],
      configuration["Cloudinary:ApiKey"],
      configuration["Cloudinary:ApiSecret"]
  );

            cloudinary = new Cloudinary(account);
        }

        public async Task<string> SaveFile(string containerName, IFormFile file)
        {
            using var stream = file.OpenReadStream();

            var uploadParams = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Folder = containerName // optional
            };

            var uploadResult = await cloudinary.UploadAsync(uploadParams);
            return uploadResult.SecureUrl.ToString();
        }

        public async Task DeleteFile(string fileRoute, string containerName)
        {
            var publicId = GetPublicId(fileRoute);
            if (string.IsNullOrEmpty(publicId)) return;

            var deletionParams = new DeletionParams(publicId);
            await cloudinary.DestroyAsync(deletionParams);
        }

        public async Task<string> EditFile(string containerName, IFormFile file, string fileRoute)
        {
            await DeleteFile(fileRoute, containerName);
            return await SaveFile(containerName, file);
        }

        private string GetPublicId(string fileUrl)
        {
            var uri = new Uri(fileUrl);
            var segments = uri.AbsolutePath.Trim('/').Split('/');
            var filename = Path.GetFileNameWithoutExtension(segments.Last());

            var folder = string.Join("/", segments.Take(segments.Length - 1));
            return string.IsNullOrEmpty(folder) ? filename : $"{folder}/{filename}";
        }
    }
}
