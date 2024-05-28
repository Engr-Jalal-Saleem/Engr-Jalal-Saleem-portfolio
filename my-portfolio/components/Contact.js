const Contact = () => {
    return (
      <section id="contact" className="py-24 text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">Contact</h2>
          <form action="https://formspree.io/f/mnqyglvg" method="POST" className="space-y-6">
            <div>
              <label htmlFor="name" className="block text-left font-medium">Name</label>
              <input type="text" id="name" name="name" className="w-full p-2 border rounded-lg" required />
            </div>
            <div>
              <label htmlFor="email" className="block text-left font-medium">Email</label>
              <input type="email" id="email" name="_replyto" className="w-full p-2 border rounded-lg" required />
            </div>
            <div>
              <label htmlFor="message" className="block text-left font-medium">Message</label>
              <textarea id="message" name="message" className="w-full p-2 border rounded-lg" rows="6" required></textarea>
            </div>
            <button type="submit" className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg">Send Message</button>
          </form>
        </div>
      </section>
    );
  };
  
  export default Contact;
  