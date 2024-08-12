import React, { useState, useContext, useEffect } from "react";
import { Editor } from "@tinymce/tinymce-react";
import { BsFillArrowLeftCircleFill } from "react-icons/bs";
import myContext from "../../context/data/myContext";
import { Link, useNavigate, useParams } from "react-router-dom";
import { Button, Typography } from "@material-tailwind/react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import toast from "react-hot-toast";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { fireDB, storage } from "../../firebase/FirebaseConfig";
import { Timestamp } from "firebase/firestore/lite";

function EditBlog() {
  const context = useContext(myContext);
  const { mode } = context;

  const navigate = useNavigate();
  const { id } = useParams();

  const [blogs, setBlogs] = useState({
    title: "",
    category: "",
    content: "",
    time: null,
  });

  console.log(blogs)
  
  const [thumbnail, setthumbnail] = useState(null);
  const [existingThumbnail, setExistingThumbnail] = useState("");

  useEffect(() => {
    const fetchBlogPost = async () => {
      setLoading(true);
      console.log("Fetching blog post with ID:", id);
  
      try {
        const docRef = doc(fireDB, "blogPost", id);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("Fetched Blog Data:", data.blogs);
          setBlogs(data.blogs);
          setExistingThumbnail(data.thumbnail);
        } else {
          console.error("No such document!");
          toast.error("Blog post not found");
        }
      } catch (error) {
        console.error("Error fetching blog post:", error);
        toast.error("Error fetching blog post");
      } finally {
        setLoading(false);
      }
    };
  
    fetchBlogPost();
  }, [id]);
  

  //* Edit Post Function
  const editPost = async () => {
    if (
      blogs.title === "" ||
      blogs.category === "" ||
      blogs.content === "" ||
      (!thumbnail && !existingThumbnail)
    ) {
      toast.error("Please Fill All Fields");
      return;
    }
    uploadImage();
  };

  //* Upload Image Function
  const uploadImage = () => {
    if (!thumbnail) {
      updateBlogPost(existingThumbnail);
    } else {
      const imageRef = ref(storage, `blogimage/${thumbnail.name}`);
      uploadBytes(imageRef, thumbnail).then((snapshot) => {
        getDownloadURL(snapshot.ref).then((url) => {
          updateBlogPost(url);
        });
      });
    }
  };

  const updateBlogPost = async (imageUrl) => {
    const docRef = doc(fireDB, "blogPost", id);
    try {
      await updateDoc(docRef, {
        blogs: {
          ...blogs,
          thumbnail: imageUrl,
          time: blogs.time || Timestamp.now(),
        },
      });
      navigate("/dashboard");
      toast.success("Post Updated Successfully");
    } catch (error) {
      toast.error(error.message);
    }
  };

  const [text, settext] = useState("");
  console.log("Value: ");
  console.log("text: ", text);

  //* Create markup function
  function createMarkup(c) {
    return { __html: c };
  }

  return (
    <div className=" container mx-auto max-w-5xl py-6">
      <div
        className="p-5"
        style={{
          background: mode === "dark" ? "#353b48" : "rgb(226, 232, 240)",
          borderBottom:
            mode === "dark"
              ? " 4px solid rgb(226, 232, 240)"
              : " 4px solid rgb(30, 41, 59)",
        }}
      >
        {/* Top Item  */}
        <div className="mb-2 flex justify-between">
          <div className="flex gap-2 items-center">
            {/* Dashboard Link  */}
            <Link to={"/dashboard"}>
              <BsFillArrowLeftCircleFill size={25} />
            </Link>

            {/* Text  */}
            <Typography
              variant="h4"
              style={{
                color: mode === "dark" ? "white" : "black",
              }}
            >
              Edit blog
            </Typography>
          </div>
        </div>

        {/* main Content  */}
        <div className="mb-3">
          {/* Thumbnail  */}
          {(thumbnail || existingThumbnail) && (
            <img
              className="w-full rounded-md mb-3"
              src={
                thumbnail ? URL.createObjectURL(thumbnail) : existingThumbnail
              }
              alt="thumbnail"
            />
          )}

          {/* Text  */}
          <Typography
            variant="small"
            color="blue-gray"
            className="mb-2 font-semibold"
            style={{ color: mode === "dark" ? "white" : "black" }}
          >
            Upload New Thumbnail (Optional)
          </Typography>

          {/* Thumbnail Input  */}
          <input
            type="file"
            label="Upload thumbnail"
            className="shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] placeholder-black w-full rounded-md p-1"
            style={{
              background: mode === "dark" ? "#dcdde1" : "rgb(226, 232, 240)",
            }}
            onChange={(e) => setthumbnail(e.target.files[0])}
          />
        </div>

        {/* Title Input */}
        <div className="mb-3">
          <input
            label="Enter your Title"
            className={`shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] w-full rounded-md p-1.5 
                 outline-none ${
                   mode === "dark" ? "placeholder-black" : "placeholder-black"
                 }`}
            placeholder="Enter Your Title"
            style={{
              background: mode === "dark" ? "#dcdde1" : "rgb(226, 232, 240)",
            }}
            name="title"
            onChange={(e) => setBlogs({ ...blogs, title: e.target.value })}
            value={blogs.title}
          />
        </div>

        {/* Category Input  */}
        <div className="mb-3">
          <input
            label="Enter your Category"
            className={`shadow-[inset_0_0_4px_rgba(0,0,0,0.6)] w-full rounded-md p-1.5 
                 outline-none ${
                   mode === "dark" ? "placeholder-black" : "placeholder-black"
                 }`}
            placeholder="Enter Your Category"
            style={{
              background: mode === "dark" ? "#dcdde1" : "rgb(226, 232, 240)",
            }}
            name="category"
            onChange={(e) => setBlogs({ ...blogs, category: e.target.value })}
            value={blogs.category}
          />
        </div>

        {/* Editor  */}
        <Editor
          apiKey="w38kv5q62vykaqits43q9ocxnz5dgcqgl0rtg7sts7fzo4nz"
          onEditorChange={(newValue, editor) => {
            setBlogs({ ...blogs, content: newValue });
            settext(editor.getContent({ format: "text" }));
          }}
          onInit={(evt, editor) => {
            settext(editor.getContent({ format: "text" }));
          }}
          value={blogs.content}
          init={{
            plugins:
              "a11ychecker advcode advlist advtable anchor autocorrect autolink autoresize autosave casechange charmap checklist code codesample directionality editimage emoticons export footnotes formatpainter fullscreen help image importcss inlinecss insertdatetime link linkchecker lists media mediaembed mentions mergetags nonbreaking pagebreak pageembed permanentpen powerpaste preview quickbars save searchreplace table tableofcontents template tinydrive tinymcespellchecker typography visualblocks visualchars wordcount",
          }}
        />

        {/* Submit Button  */}
        <Button
          className="w-full mt-5"
          onClick={editPost}
          style={{
            background:
              mode === "dark" ? "rgb(226, 232, 240)" : "rgb(30, 41, 59)",
            color: mode === "dark" ? "rgb(30, 41, 59)" : "rgb(226, 232, 240)",
          }}
        >
          Update
        </Button>

        {/* Preview Section  */}
        <div className="">
          <h1 className="text-center mb-3 text-2xl">Preview</h1>
          <div className="content">
            <div
              className={`[&> h1]:text-[32px] [&>h1]:font-bold  [&>h1]:mb-2.5
                        ${
                          mode === "dark"
                            ? "[&>h1]:text-[#ff4d4d]"
                            : "[&>h1]:text-black"
                        }

                        [&>h2]:text-[24px] [&>h2]:font-bold [&>h2]:mb-2.5
                        ${
                          mode === "dark"
                            ? "[&>h2]:text-white"
                            : "[&>h2]:text-black"
                        }

                        [&>h3]:text-[18.72] [&>h3]:font-bold [&>h3]:mb-2.5
                        ${
                          mode === "dark"
                            ? "[&>h3]:text-white"
                            : "[&>h3]:text-black"
                        }

                        [&>h4]:text-[16px] [&>h4]:font-bold [&>h4]:mb-2.5
                        ${
                          mode === "dark"
                            ? "[&>h4]:text-white"
                            : "[&>h4]:text-black"
                        }

                        [&>h5]:text-[13.28px] [&>h5]:font-bold [&>h5]:mb-2.5
                        ${
                          mode === "dark"
                            ? "[&>h5]:text-white"
                            : "[&>h5]:text-black"
                        }

                        [&>h6]:text-[10.72px] [&>h6]:font-bold [&>h6]:mb-2.5
                        ${
                          mode === "dark"
                            ? "[&>h6]:text-white"
                            : "[&>h6]:text-black"
                        }

                        [&> p]:leading-7
                        ${
                          mode === "dark"
                            ? "[&> p]:text-white"
                            : "[&> p]:text-black"
                        }

                        [&>figure>table>thead>tr>th]:font-bold
                        ${
                          mode === "dark"
                            ? "[&>figure>table>thead>tr>th]:text-white"
                            : "[&>figure>table>thead>tr>th]:text-black"
                        }

                        [&>figure>table>tbody>tr>td]:leading-7
                        ${
                          mode === "dark"
                            ? "[&>figure>table>tbody>tr>td]:text-white"
                            : "[&>figure>table>tbody>tr>td]:text-black"
                        }`}
              dangerouslySetInnerHTML={createMarkup(blogs.content)}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EditBlog;
