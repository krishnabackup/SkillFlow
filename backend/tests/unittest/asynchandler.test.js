const asynchandler = require("../../src/utils/asynchandler");

describe("asynchandler utility", () => {
    test("should execute async function and return result", async () => {
      const req = {};
      const res = {send : jest.fn()};
      const next = jest.fn();
      
      const handler = jest.fn(async (req, res,next) => {
        res.send("Success");
      });
      const wrappedHandler = asynchandler(handler);
      await wrappedHandler(req, res, next);

      expect(handler).toHaveBeenCalledTimes(1);
      expect(res.send).toHaveBeenCalledWith("Success");
      expect(next).not.toHaveBeenCalled();
    });
    test("should catch error and call next with error", async () => {
      const req = {};
      const res = {};
      const next = jest.fn();
     
      const error = new Error("Test error");
      const handler = jest.fn(async (req, res,next) => {
        throw error;
      });
     const wrappedHandler = asynchandler(handler);
     await wrappedHandler(req, res, next);

     expect(handler).toHaveBeenCalledTimes(1);
     expect(next).toHaveBeenCalledWith(error);
     }); 

     test("should call next if hanlder rejects promise", async () => {
        const req = {};
        const res = {};
        const next = jest.fn();
        const error = new Error("Promise rejection");
        const handler = jest.fn(() => Promise.reject(error));
        const wrappedHandler = asynchandler(handler);
        await wrappedHandler(req, res, next);


        expect(next).toHaveBeenCalledWith(error);    
     })
})
